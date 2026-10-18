import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-6 px-6 text-center w-full">
      <div className="flex gap-6 items-center h-[100px] w-full justify-end">
        {" "}
        <Link
          href="/vocabulary"
          className="rounded-full bg-foreground px-6 py-3 text-background transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-200"
        >
          Vocabulary
        </Link>
        <Link
          href="/tenses"
          className="rounded-full bg-foreground px-6 py-3 text-background transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-200"
        >
          Tenses
        </Link>
      </div>
      <h1 className="text-4xl font-semibold tracking-tight">My Dictionary</h1>
      <p className="max-w-md text-zinc-600 dark:text-zinc-400">
        Build topics, collect words and practice your vocabulary in one place.
      </p>
    </main>
  );
}
