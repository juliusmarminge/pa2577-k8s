import type { APIRoute } from "astro";
import { z } from "zod";
import { createTranscript } from "../../db";

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();

  const input = z
    .object({
      label: z.string().min(3),
      file: z.instanceof(File),
    })
    .parse(Object.fromEntries(formData.entries()));

  // Simulate a delay since we don't have that locally
  await new Promise((r) => setTimeout(r, 1000));

  const id = await createTranscript(input.label);

  console.log("Enqueuing job");
  const form = new FormData();
  form.append("file", input.file);
  form.append("transcript_id", id);

  await fetch(new URL("/jobs/enqueue", process.env.WORKER_URL), {
    method: "POST",
    body: form,
    // headers: {
    //   "Content-Type": "multipart/form-data",
    // },
  })
    .then((r) => r.json())
    .then(console.log)
    .catch(console.error);
  console.log("Job enqueued");

  return new Response(
    JSON.stringify({
      message: "Success!",
    }),
    { status: 200 }
  );
};
