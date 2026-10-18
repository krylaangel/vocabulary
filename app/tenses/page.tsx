import Link from 'next/link';

import connectToDatabase from '@/lib/mongodb';
import Tenses from "@/models/Tenses";
import ImportModal from "@/components/ImportModal";

export const dynamic = 'force-dynamic';

export default async function TensesPage() {
    await connectToDatabase();

    const [tenses, tensesCount] = await Promise.all([
        Tenses.find({})
            .sort({ createdAt: -1 })
            .lean(),

        Tenses.countDocuments(),
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
                    English Tenses
                </h1>

                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {tensesCount} {tensesCount === 1 ? 'tense' : 'tenses'}
                </p>
            </header>

            {tenses.length === 0 ? (
                <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
                    <p className="text-zinc-500">
                        No tenses added yet.
                    </p>

                    <p className="mt-1 text-sm text-zinc-400">
                        Create your first tense rule to start learning grammar.
                    </p>
                </div>
            ) : (
                <ul className="flex flex-col gap-3">
                    {tenses.map((tense) => (
                        <li key={tense._id.toString()}>
                            <Link
                                href={`/tenses/${tense._id.toString()}`}
                                className="flex items-center gap-3 rounded-lg border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                            >
                                {tense.color && (
                                    <span
                                        className="h-3 w-3 shrink-0 rounded-full"
                                        style={{
                                            backgroundColor: tense.color,
                                        }}
                                    />
                                )}

                                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="font-medium">
                    {tense.title}
                  </span>

                                    {tense.description && (
                                        <span className="text-sm text-zinc-500">
                      {tense.description}
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
                    href="/tenses/new"
                    className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 dark:bg-white dark:text-zinc-900"
                >
                    + New tense
                </Link>

                <ImportModal
                    apiEndpoint="/api/tenses"
                    title="Імпорт часів з JSON"
                />
            </div>
        </main>
    );
}