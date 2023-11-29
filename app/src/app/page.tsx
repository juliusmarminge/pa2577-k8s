import { SubmitAudioForm } from "../components/submit-audio-form";

export default function Home() {
  return (
    <div className="flex flex-col gap-8 p-4">
      <div>
        <h1 className="text-xl font-bold">Welcome Home!</h1>
        <p className="text-gray-500">Upload an audio file for transcription.</p>
      </div>

      <SubmitAudioForm />
    </div>
  );
}
