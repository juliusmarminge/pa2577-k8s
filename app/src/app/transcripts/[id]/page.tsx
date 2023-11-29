import { notFound } from "next/navigation";
import { z } from "zod";
import { getTranscriptById } from "~/src/db";

export default async function TranscriptDetailsPage(props: {
  params: { id: string };
}) {
  const id = z.string().parse(props.params.id);
  const transcript = await getTranscriptById(id);

  if (!transcript) notFound();

  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="font-bold text-lg">{transcript.label}</h1>
      <p className="">{transcript.transcript}</p>
    </div>
  );
}
