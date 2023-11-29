"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Input } from "./input";
import { Button } from "./button";

export function SubmitAudioForm() {
  const [file, setFile] = useState<File | null>(null);
  const [label, setLabel] = useState("");

  const handleSubmit = async () => {
    if (!file || !label) {
      return toast.error("Please fill out all fields!");
    }
    const fd = new FormData();
    fd.append("file", file);
    fd.append("label", label);

    const promise = fetch("/api/upload", {
      method: "POST",
      body: fd,
    }).then((res) => {
      if (res.ok) return res.json();
      throw new Error(res.statusText);
    });

    toast.promise(promise, {
      loading: "Uploading audio file...",
      success: "Audio file uploaded successfully!",
      error: "Something went wrong!",
    });
  };

  const [recording, setRecording] = useState(false);
  const recorder = useRef<MediaRecorder | null>(null);
  async function handleRecording() {
    if (recording) {
      recorder.current?.stop();
      recorder.current = null;
      setRecording(false);
      return;
    }

    const media = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    recorder.current = new MediaRecorder(media);
    recorder.current.addEventListener("dataavailable", (e) => {
      console.log("dataavailable", e.data);

      const file = new File([e.data], "__recording.webm", {
        type: "audio/webm",
      });
      setFile(file);
    });
    recorder.current.start();

    setRecording(true);
  }

  console.log(file);

  return (
    <div className="flex flex-col gap-4 max-w-sm">
      <label className="flex flex-col">
        <span className="text-sm font-semibold">Label:</span>
        <Input value={label} onChange={(e) => setLabel(e.target.value)} />
      </label>

      <div className="flex gap-4 items-end">
        <label className="flex flex-col flex-1">
          <span className="text-sm font-semibold">File:</span>
          <Input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            accept="audio/*"
            disabled={recording || file?.name === "__recording.webm"}
          />
        </label>
        <Button
          className={`h-10 aspect-square ${
            recording
              ? "bg-red-800 hover:bg-red-700"
              : "bg-zinc-800 hover:bg-zinc-700"
          }`}
          onClick={handleRecording}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="fill-none h-6 w-6 stroke-2 stroke-current"
          >
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="22" />
          </svg>
        </Button>
      </div>

      <Button onClick={handleSubmit} disabled={recording}>
        Submit
      </Button>
    </div>
  );
}
