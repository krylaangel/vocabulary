import Link from 'next/link';

import connectToDatabase from '@/lib/mongodb';
import Topic from '@/models/Topic';
import Word from '@/models/Word';

export const dynamic = 'force-dynamic';

export default async function VocabularyPage() {
  await connectToDatabase();

  const [topics, wordsCount] = await Promise.all([
    Topic.find({})
        .sort({ createdAt: -1 })
        .lean(),

    Word.countDocuments(),
  ]);

  return (
      <main className="container-page">
        <header className="flex flex-col gap-2">
          <Link
              href="/"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            ← Back
          </Link>

          <h1 className="text-3xl font-semibold tracking-tight">
            Vocabulary
          </h1>

          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {topics.length} topics · {wordsCount} words
          </p>
        </header>

        {topics.length === 0 ? (
            <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
              <p className="text-zinc-500">
                No topics yet.
              </p>

              <p className="mt-1 text-sm text-zinc-400">
                Create your first topic to start learning vocabulary.
              </p>
            </div>
        ) : (
            <ul className="flex flex-col gap-3">
              {topics.map((topic) => (
                  <li key={topic._id.toString()}>
                    <Link
                        href={`/vocabulary/${topic._id.toString()}`}
                        className="flex items-center gap-3 rounded-lg border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                    >
                <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{
                      backgroundColor: topic.color,
                    }}
                />

                      <div className="flex min-w-0 flex-1 flex-col">
                  <span className="font-medium">
                    {topic.title}
                  </span>

                        {topic.description && (
                            <span className="text-sm text-zinc-500">
                      {topic.description}
                    </span>
                        )}
                      </div>

                      <span className="text-zinc-400">
                  →
                </span>
                    </Link>
                  </li>
              ))}
            </ul>
        )}
        <div className="flex items-center justify-between gap-4">
                   <Link
              href="/vocabulary/new"
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 dark:bg-white dark:text-zinc-900"
          >
            + New topic
          </Link>
        </div>
      </main>
  );
}