import Link from "next/link";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8f8ff_0%,#f5f7fb_34%,#ffffff_100%)] text-gray-950">
      <Navbar variant="home" />

      <section className="relative overflow-hidden px-6 pb-20 pt-16 sm:pb-28 sm:pt-24">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.18),rgba(79,70,229,0)_68%)]" />
          <div className="absolute right-[-8rem] top-24 h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.16),rgba(14,165,233,0)_70%)]" />
          <div className="absolute left-[-6rem] top-48 h-[20rem] w-[20rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(244,114,182,0.12),rgba(244,114,182,0)_70%)]" />
        </div>

        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,1.05fr)_24rem] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-medium text-gray-700 shadow-[0_10px_35px_rgba(15,23,42,0.07)] backdrop-blur">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Grounded AI workflows for your internal knowledge
            </div>

            <h1 className="mt-8 max-w-4xl text-5xl font-semibold tracking-[-0.05em] text-gray-950 sm:text-6xl lg:text-7xl">
              Turn documents into a{" "}
              <span className="bg-[linear-gradient(120deg,#4f46e5_0%,#0ea5e9_55%,#111827_100%)] bg-clip-text text-transparent">
                clean, searchable conversation layer
              </span>
              .
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600 sm:text-xl">
              Ingest files, structure the content, and ask questions in one
              calm workflow. Built for teams that want answers tied to their
              own material instead of generic AI guesses.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/chat"
                className="inline-flex items-center justify-center rounded-2xl bg-gray-950 px-7 py-4 text-base font-semibold text-white shadow-[0_14px_40px_rgba(17,24,39,0.22)] transition-transform hover:-translate-y-0.5 hover:bg-gray-800"
              >
                Open Chat Workspace
              </Link>
              <Link
                href="/ingest"
                className="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white/85 px-7 py-4 text-base font-semibold text-gray-700 shadow-[0_10px_28px_rgba(15,23,42,0.06)] backdrop-blur transition-transform hover:-translate-y-0.5 hover:border-gray-300 hover:bg-white"
              >
                Upload Documents
              </Link>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/70 bg-white/75 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] backdrop-blur">
                <p className="text-2xl font-semibold tracking-[-0.04em] text-gray-950">
                  1 flow
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Upload, structure, and chat without bouncing between tools.
                </p>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/75 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] backdrop-blur">
                <p className="text-2xl font-semibold tracking-[-0.04em] text-gray-950">
                  Grounded
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Responses stay anchored to the knowledge you uploaded.
                </p>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/75 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] backdrop-blur">
                <p className="text-2xl font-semibold tracking-[-0.04em] text-gray-950">
                  Fast setup
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Start with a single ingestion endpoint and a ready chat UI.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-[linear-gradient(160deg,rgba(79,70,229,0.18),rgba(14,165,233,0.08),rgba(255,255,255,0.4))] blur-2xl" />
            <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,rgba(17,24,39,0.98),rgba(15,23,42,0.94))] p-6 text-white shadow-[0_30px_80px_rgba(15,23,42,0.28)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/60">
                    Live knowledge session
                  </p>
                  <p className="mt-1 text-lg font-semibold">Project handbook</p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-emerald-300">
                  Connected
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                    Upload
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/80">
                    PDF processed and broken into grounded context blocks for
                    retrieval-aware answers.
                  </p>
                </div>

                <div className="rounded-2xl border border-indigo-400/20 bg-indigo-400/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-indigo-200/80">
                    Ask
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white">
                    “What changed in the onboarding process, and what decisions
                    should the team keep in mind?”
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                    Answer
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/80">
                    Summarized guidance, tied back to the uploaded source
                    material, ready to reuse in chat.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/8 px-3 py-1.5 text-xs font-medium text-white/75">
                  Summaries
                </span>
                <span className="rounded-full bg-white/8 px-3 py-1.5 text-xs font-medium text-white/75">
                  Comparisons
                </span>
                <span className="rounded-full bg-white/8 px-3 py-1.5 text-xs font-medium text-white/75">
                  Grounded responses
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-10">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-gray-200/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)] backdrop-blur sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-gray-400">
                Built for a simple loop
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-gray-950 sm:text-3xl">
                Bring knowledge in. Get useful answers back out.
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-gray-50 px-5 py-4 text-sm font-medium text-gray-700">
                Ingest documents
              </div>
              <div className="rounded-2xl bg-gray-50 px-5 py-4 text-sm font-medium text-gray-700">
                Structure the content
              </div>
              <div className="rounded-2xl bg-gray-950 px-5 py-4 text-sm font-medium text-white">
                Chat with confidence
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-indigo-500">
              Core workflows
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-gray-950 sm:text-5xl">
              Modern knowledge management without a messy interface.
            </h2>
            <p className="mt-5 text-lg leading-8 text-gray-600">
              The product now focuses on two clear jobs: getting your material
              into the system and turning it into dependable answers.
            </p>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-10">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      />
                    </svg>
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold tracking-[-0.04em] text-gray-950">
                    Document ingestion
                  </h3>
                  <p className="mt-4 max-w-xl text-base leading-7 text-gray-600">
                    Upload files once, then let the system extract text, shape
                    it into usable chunks, and prepare it for grounded chat
                    sessions.
                  </p>
                </div>
                <div className="hidden rounded-2xl bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 sm:block">
                  POST /ingest
                </div>
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-gray-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                    Step 01
                  </p>
                  <p className="mt-3 text-base font-medium text-gray-900">
                    Upload PDFs and files
                  </p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                    Step 02
                  </p>
                  <p className="mt-3 text-base font-medium text-gray-900">
                    Extract and organize content
                  </p>
                </div>
                <div className="rounded-2xl bg-gray-950 p-5 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                    Step 03
                  </p>
                  <p className="mt-3 text-base font-medium">
                    Prepare context for answers
                  </p>
                </div>
              </div>

              <Link
                href="/ingest"
                className="mt-8 inline-flex items-center text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
              >
                Go to ingestion
                <span className="ml-2">→</span>
              </Link>
            </div>

            <div className="grid gap-8">
              <div className="overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,#1f1b4f_0%,#131a2b_100%)] p-8 text-white shadow-[0_24px_60px_rgba(15,23,42,0.18)] sm:p-10">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-violet-200">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                    />
                  </svg>
                </div>
                <h3 className="mt-6 text-2xl font-semibold tracking-[-0.04em]">
                  AI chat
                </h3>
                <p className="mt-4 text-base leading-7 text-white/70">
                  Ask for summaries, compare documents, and pull out decisions
                  quickly with answers grounded in the source material.
                </p>

                <div className="mt-8 space-y-3">
                  <div className="rounded-2xl border border-white/10 bg-white/6 p-4 text-sm font-medium text-white">
                    Summarize long documents in seconds
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/6 p-4 text-sm font-medium text-white">
                    Compare themes across multiple files
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/6 p-4 text-sm font-medium text-white">
                    Keep responses tied to your knowledge base
                  </div>
                </div>

                <Link
                  href="/chat"
                  className="mt-8 inline-flex items-center text-sm font-semibold text-violet-200 transition-colors hover:text-white"
                >
                  Open chat
                  <span className="ml-2">→</span>
                </Link>
              </div>

              <div className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-400">
                  Typical uses
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
                    Policy Q&A
                  </span>
                  <span className="rounded-full bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700">
                    Research summaries
                  </span>
                  <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                    Team onboarding
                  </span>
                  <span className="rounded-full bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700">
                    Decision recall
                  </span>
                </div>
                <p className="mt-6 text-sm leading-7 text-gray-600">
                  Designed for teams that need a sharper way to explore internal
                  knowledge without building a complicated search workflow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-8">
        <div className="mx-auto max-w-7xl border-y border-gray-200 py-8">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-semibold text-gray-400">
            <span>Next.js 16</span>
            <span>React 19</span>
            <span>Tailwind 4</span>
            <span>Prisma 7</span>
            <span>PostgreSQL</span>
            <span>Google AI</span>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[2.25rem] bg-[linear-gradient(135deg,#0f172a_0%,#312e81_52%,#0ea5e9_100%)] p-[1px] shadow-[0_30px_90px_rgba(49,46,129,0.22)]">
          <div className="rounded-[2.2rem] bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(17,24,39,0.85))] px-6 py-14 text-center text-white sm:px-12">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/55">
              Ready when you are
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] sm:text-5xl">
              Start with your documents. End with answers your team can trust.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/70">
              Upload content, open chat, and turn static files into an AI
              workspace that actually helps with day-to-day work.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/chat"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-7 py-4 text-base font-semibold text-gray-950 transition-transform hover:-translate-y-0.5 hover:bg-slate-100"
              >
                Launch app
              </Link>
              <Link
                href="/ingest"
                className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/8 px-7 py-4 text-base font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-white/12"
              >
                View ingestion
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="px-6 pb-10 pt-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-950 text-xs font-bold text-white">
              AI
            </div>
            <span className="text-sm font-medium text-gray-900">
              AI Knowledge App
            </span>
          </div>
          <p className="text-sm text-gray-400">
            Built with Next.js, Prisma, PostgreSQL, and Google Generative AI
          </p>
        </div>
      </footer>
    </main>
  );
}
