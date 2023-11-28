import { toast } from "sonner";

export function SubmitAudioForm() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
      <label className="flex flex-col">
        <span className="text-sm font-semibold">Label:</span>
        <input
          type="text"
          required
          name="label"
          className="flex w-full rounded-md border px-3 py-2 text-sm shadow-sm placeholder:text-gray-600"
        />
      </label>
      <label className="flex flex-col">
        <span className="text-sm font-semibold">File:</span>
        <input
          type="file"
          accept="audio/*"
          name="file"
          required
          className="flex w-full rounded-md border px-3 py-2 text-sm shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium"
        />
      </label>

      <button
        className="inline-flex bg-zinc-800 text-white py-2 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium disabled:pointer-events-none disabled:opacity-50"
        type="submit"
      >
        Submit
      </button>
    </form>
  );
}
