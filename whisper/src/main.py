"""
Simple web server that accepts audio files and transcribes them using whisper.
Transcription is done in the background using asyncio, making sure only a single
file is transcribed at a time. This is done to prevent the model from running out
of memory on smaller machines.

Scaling is done by deploying multiple instances of it behind a load balancer.
"""

from asyncio import create_task, get_event_loop
from concurrent.futures import ThreadPoolExecutor
from os import remove as remove_file, path
from typing import Annotated
from fastapi import FastAPI, UploadFile, Form
from src.db import MySQLConnection
from whisper import load_model, transcribe

app = FastAPI()
MODEL = load_model("base")
executor = ThreadPoolExecutor(max_workers=1)


async def transcribe_async(transcript_id: str, filename: str):
    """Wrapper around whisper.transcribe that runs it in a thread pool executor."""
    def _transcribe():
        whisper_response = transcribe(MODEL, filename)
        remove_file(filename)
        return whisper_response

    result = await get_event_loop().run_in_executor(executor, _transcribe)
    print(f"Transcription of {transcript_id} complete: {result['text']}")

    with MySQLConnection() as cursor:
        print(f"Updating db for {transcript_id}")
        cursor.execute(
            "UPDATE transcript SET transcript = %s, processed = true WHERE id = %s",
            (result["text"], transcript_id)
        )


@app.post("/jobs/enqueue")
async def enqueue(file: Annotated[UploadFile, Form()], transcript_id: Annotated[str, Form()]):
    # Write file to disk cause whisper can't take in memory files
    filename = transcript_id + path.splitext(file.filename)[1]
    print(f"Writing {filename} to disk")
    with open(filename, "wb") as f:
        content = await file.read()
        f.write(content)

    # Start transcribing in the background
    print(f">>> Creating task for {file.filename}")
    create_task(transcribe_async(transcript_id, filename))

    return {"status": "ok"}
