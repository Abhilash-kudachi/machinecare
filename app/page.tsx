export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-blue-400">
            MachineCare
          </p>

          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Smart Equipment
            <span className="block text-blue-400">
              Maintenance Platform
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Manage industrial machines, maintenance operations, service
            records, technicians and machine health from one intelligent
            platform.
          </p>

          <div className="mt-8 flex gap-4">
            <button className="rounded-lg bg-blue-500 px-6 py-3 font-medium transition hover:bg-blue-600">
              Get Started
            </button>

            <button className="rounded-lg border border-slate-700 px-6 py-3 font-medium transition hover:bg-slate-900">
              View Demo
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
