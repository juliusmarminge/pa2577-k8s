import { getAllTranscripts } from "~/src/db";

export default async function TranscriptsLayout(props: {
  children: React.ReactNode;
}) {
  const transcripts = await getAllTranscripts();

  return (
    <div className="p-4 flex divide-x gap-8">
      {transcripts.length === 0 && (
        <h1 className="font-bold text-lg">
          You haven't uploaded any audio files yet so there are no transcripts
          available.
        </h1>
      )}
      <div className="flex flex-col gap-4 w-full max-w-lg max-h-[90vh] overflow-y-scroll">
        {transcripts.map((t) => {
          return (
            <div
              key={t.id}
              className="rounded-lg p-4 flex flex-col gap-4 border bg-card shadow-sm"
            >
              <div className="flex justify-between">
                <h3 className="text-xl font-semibold leading-none tracking-tight">
                  {t.label}
                </h3>
                {!t.processed && (
                  <div
                    className={
                      "inline-flex items-center rounded-full border px-2.5 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-amber-100 text-amber-800"
                    }
                  >
                    Processing
                  </div>
                )}
              </div>
              <a
                href={`/transcripts/${t.id}`}
                className="mr-auto block text-primary hover:text-primary/80 underline"
              >
                Read more
              </a>
            </div>
          );
        })}
      </div>
      {props.children}
    </div>
  );
}
