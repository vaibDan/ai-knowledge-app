import Link from "next/link";
import Navbar from "./components/Navbar";

export default function Home() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar variant="home" />

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-20 pb-24 sm:pt-32 sm:pb-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-indigo-50 opacity-60 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[600px] rounded-full bg-purple-50 opacity-40 blur-3xl" />
        </div>

        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
            <span className="mr-2 flex h-2 w-2 rounded-full bg-indigo-500" />
            Powered by Google Generative AI
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Your documents,{" "}
            <span className="text-indigo-600">intelligently understood</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Upload your documents, search them semantically, and chat with an AI
            that truly understands your content. Turn your knowledge base into an
            intelligent assistant.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/chat"
              className="w-full rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md sm:w-auto"
            >
              Start Chatting
            </Link>
            <Link
              href="#features"
              className="w-full rounded-xl border border-gray-200 bg-white px-8 py-3.5 text-base font-semibold text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300 sm:w-auto"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to manage knowledge
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Three powerful tools working together to make your documents
              accessible and actionable.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Document Ingestion */}
            <div className="group relative rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-md hover:ring-indigo-200">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
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
              <h3 className="text-lg font-semibold text-gray-900">
                Document Ingestion
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                Upload and process your documents with a single API call. Our
                ingestion pipeline automatically extracts, chunks, and vectorizes
                your content for instant semantic search.
              </p>
              <div className="mt-6">
                <span className="inline-flex items-center text-sm font-medium text-blue-600">
                  <Link href="/ingest" passHref>
                    POST /ingest
                  </Link>
                  <svg
                    className="ml-1 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </div>
            </div>

            {/* Semantic Search */}
            <div className="group relative rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-md hover:ring-indigo-200">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
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
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Semantic Search
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                Find exactly what you need, even when you dont know the exact
                keywords. Our vector search understands meaning and context,
                delivering precise results from your document library.
              </p>
              <div className="mt-6">
                <span className="inline-flex items-center text-sm font-medium text-emerald-600">
                  <Link href="/api/search" passHref>
                    POST /api/search
                  </Link>
                  <svg
                    className="ml-1 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </div>
            </div>

            {/* AI Chat */}
            <div className="group relative rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-md hover:ring-indigo-200 sm:col-span-2 lg:col-span-1">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
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
              <h3 className="text-lg font-semibold text-gray-900">AI Chat</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                Have natural conversations with your documents. Ask questions,
                request summaries, or explore connections across your entire
                knowledge base with contextual, grounded responses.
              </p>
              <div className="mt-6">
                <span className="inline-flex items-center text-sm font-medium text-purple-600">
                  <Link href="/chat" passHref>
                    POST /chat
                  </Link>
                  <svg
                    className="ml-1 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Banner */}
      <section className="border-y border-gray-100 bg-white px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-sm font-medium uppercase tracking-wider text-gray-400">
            Built with modern technologies
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 opacity-60 grayscale">
            <span className="text-sm font-semibold text-gray-700">Next.js 16</span>
            <span className="text-sm font-semibold text-gray-700">React 19</span>
            <span className="text-sm font-semibold text-gray-700">Tailwind 4</span>
            <span className="text-sm font-semibold text-gray-700">Prisma 7</span>
            <span className="text-sm font-semibold text-gray-700">PostgreSQL</span>
            <span className="text-sm font-semibold text-gray-700">Google AI</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-3xl rounded-3xl bg-indigo-600 px-6 py-16 text-center sm:px-12">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to unlock your knowledge?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-indigo-100">
            Start ingesting documents and chatting with your AI assistant in
            minutes. No complex setup required.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/chat"
              className="w-full rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-indigo-600 shadow-sm transition-all hover:bg-gray-50 sm:w-auto"
            >
              Launch App
            </Link>
            <Link
              href="/api/test"
              className="w-full rounded-xl border border-indigo-400 bg-transparent px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-indigo-500 sm:w-auto"
            >
              Test API
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-white text-xs font-bold">
              AI
            </div>
            <span className="text-sm font-medium text-gray-900">
              AI Knowledge App
            </span>
          </div>
          <p className="text-sm text-gray-400">
            Built with Next.js, Prisma & Google Generative AI
          </p>
        </div>
      </footer>
    </main>
  );
}
