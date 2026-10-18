import Link from 'next/link';
import { notFound } from 'next/navigation';
import connectToDatabase from '@/lib/mongodb';
import Tenses from '@/models/Tenses';

interface TensePageProps {
    params: Promise<{
        tenseId: string;
    }>;
}

export const dynamic = 'force-dynamic';

export default async function TenseDetailPage({ params }: TensePageProps) {
    const { tenseId } = await params;

    await connectToDatabase();

    let tense;
    try {
        tense = await Tenses.findById(tenseId).lean();
    } catch {
        notFound();
    }

    if (!tense) {
        notFound();
    }

    return (
        <main className="container-page">
            <header className="flex flex-col gap-3">
                <Link
                    href="/tenses"
                    className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                    ← Back to tenses
                </Link>

                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        {tense.color && (
                            <span
                                className="h-4 w-4 rounded-full shrink-0"
                                style={{ backgroundColor: tense.color }}
                            />
                        )}
                        <h1 className="text-3xl font-semibold tracking-tight">
                            {tense.title}
                        </h1>
                    </div>

                    <Link
                        href={`/tenses/${tenseId}/edit`}
                        className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
                    >
                        Edit
                    </Link>
                </div>

                {tense.description && (
                    <p className="text-zinc-600 dark:text-zinc-400">
                        {tense.description}
                    </p>
                )}
            </header>

            <div className="mt-8 flex flex-col gap-8">
                {/* Structure */}
                {tense.structure && (
                    <section className="flex flex-col gap-4">
                        <h2 className="text-xl font-semibold">Formulas</h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                <span className="text-xs font-semibold uppercase text-emerald-600 dark:text-emerald-400">
                  Positive (+)
                </span>
                                <p className="mt-2 text-sm font-medium">
                                    {tense.structure.positive || '—'}
                                </p>
                            </div>

                            <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                <span className="text-xs font-semibold uppercase text-rose-600 dark:text-rose-400">
                  Negative (-)
                </span>
                                <p className="mt-2 text-sm font-medium">
                                    {tense.structure.negative || '—'}
                                </p>
                            </div>

                            <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                <span className="text-xs font-semibold uppercase text-sky-600 dark:text-sky-400">
                  Question (?)
                </span>
                                <p className="mt-2 text-sm font-medium">
                                    {tense.structure.question || '—'}
                                </p>
                            </div>
                        </div>
                    </section>
                )}

                {/* Time Signals */}
                {tense.timeSignals && tense.timeSignals.length > 0 && (
                    <section className="flex flex-col gap-3">
                        <h2 className="text-xl font-semibold">Time Signals</h2>
                        <div className="flex flex-wrap gap-2">
                            {tense.timeSignals.map((signal: string, idx: number) => (
                                <span
                                    key={idx}
                                    className="rounded-lg bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                                >
                  {signal}
                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Examples */}
                {tense.examples && tense.examples.length > 0 && (
                    <section className="flex flex-col gap-3">
                        <h2 className="text-xl font-semibold">Examples</h2>
                        <ul className="flex flex-col gap-2">
                            {tense.examples.map((example: string, idx: number) => (
                                <li
                                    key={idx}
                                    className="rounded-lg border border-zinc-200 p-3 text-sm dark:border-zinc-800"
                                >
                                    {example}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        </main>
    );
}