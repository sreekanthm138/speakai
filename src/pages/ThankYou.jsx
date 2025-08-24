export default function ThankYou() {
  return (
    <main className="container-p py-10 max-w-3xl">
      <h1 className="text-3xl font-bold">Thanks — your PDF is ready!</h1>
      <p className="text-muted">Click below to download.</p>
      <p className="mt-3">
        <a
          className="btn btn-primary"
          href="/lead_magnet_50_interview_prompts.html"
          download
        >
          ⬇️ Download “50 AI Interview Prompts”
        </a>
      </p>
    </main>
  );
}
