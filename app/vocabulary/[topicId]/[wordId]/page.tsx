import Link from 'next/link';
import { notFound } from 'next/navigation';

import connectToDatabase from '@/lib/mongodb';
import Topic from '@/models/Topic';
import Word from '@/models/Word';
import { WordMeaning } from '@/types/vocabulary';

export const dynamic = 'force-dynamic';

interface VocabularyWordPageProps {
    params: Promise<{
        topicId: string;
        wordId: string;
    }>;
}

export default async function VocabularyWordPage({
                                                     params,
                                                 }: VocabularyWordPageProps) {
    const { topicId, wordId } = await params;

    await connectToDatabase();

    const [topic, word] = await Promise.all([
        Topic.findById(topicId).lean(),
        Word.findOne({
            _id: wordId,
            topics: topicId,
        }).lean(),
    ]);

    if (!topic || !word) {
        notFound();
    }

    return (
        <main className="container-page">
            <header className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                    <Link
                        href={`/vocabulary/${topicId}`}
                        className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
                    >
                        ← Back to {topic.title}
                    </Link>

                    <Link
                        href={`/vocabulary/${topicId}/${wordId}/edit`}
                        className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
                    >
                        Edit
                    </Link>
                </div>

                <div className="flex items-start justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-semibold tracking-tight">
                            {word.word}
                        </h1>

                        {word.transcription && (
                            <p className="mt-2 text-lg text-zinc-500">
                                {word.transcription}
                            </p>
                        )}
                    </div>

                    <span className="shrink-0 rounded-md bg-zinc-100 px-3 py-1.5 text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            {word.level}
          </span>
                </div>

                <div className="flex items-center gap-3 text-sm">
          <span className="rounded-md bg-zinc-100 px-2 py-1 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            {word.status}
          </span>

                    {word.isFavorite && (
                        <span className="text-yellow-500">
              ★ Favorite
            </span>
                    )}
                </div>
            </header>

            <section className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold">
                    Meanings
                </h2>

                <div className="flex flex-col gap-4">
                    {word.meanings.map((meaning:WordMeaning, index: number) => (
                        <article
                            key={meaning._id?.toString() || index.toString()}
                            className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800"
                        >
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-medium">
                                    {meaning.translation}
                                </h3>

                                {meaning.partOfSpeech !== 'other' && (
                                    <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-500 dark:bg-zinc-800">
                    {meaning.partOfSpeech}
                  </span>
                                )}
                            </div>

                            {meaning.example && (
                                <div className="mt-4">
                                    <p className="text-zinc-800 dark:text-zinc-200">
                                        {meaning.example}
                                    </p>

                                    {meaning.exampleTranslation && (
                                        <p className="mt-1 text-sm text-zinc-500">
                                            {meaning.exampleTranslation}
                                        </p>
                                    )}
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            </section>

            <div className="border-t border-zinc-200 pt-6 text-sm text-zinc-500 dark:border-zinc-800">
                Topic: {topic.title}
            </div>
        </main>
    );
}