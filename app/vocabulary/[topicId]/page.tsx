import Link from 'next/link';
import { notFound } from 'next/navigation';

import connectToDatabase from '@/lib/mongodb';
import Topic from '@/models/Topic';
import Word from '@/models/Word';
import {WordMeaning} from "@/types/vocabulary";
import ImportWordsModal from "@/components/ImportWordsModal";

export const dynamic = 'force-dynamic';

interface VocabularyTopicPageProps {
    params: Promise<{
        topicId: string;
    }>;
}

export default async function VocabularyTopicPage({
                                                      params,
                                                  }: VocabularyTopicPageProps) {
    const { topicId } = await params;

    await connectToDatabase();

    const [topic, words] = await Promise.all([
        Topic.findById(topicId).lean(),
        Word.find({ topics: topicId })
            .sort({ word: 1 })
            .lean(),
    ]);

    if (!topic) {
        notFound();
    }

    return (
        <main className="container-page">
            <header className="flex flex-col gap-3">
                <div className="flex w-full items-center justify-between gap-4">
                    <Link
                        href="/vocabulary"
                        className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
                    >
                        ← Back to vocabulary
                    </Link>

                    <div className="flex items-center gap-2">
                        <Link
                            href={`/vocabulary/${topic._id}/edit`}
                            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
                        >
                            Edit
                        </Link>

                        <Link
                            href={`/vocabulary/${topic._id}/words/new`}
                            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 dark:bg-white dark:text-zinc-900"
                        >
                            + New word
                        </Link>
                        <ImportWordsModal topicId={topicId} />
                    </div>
                </div>

                <div className="flex items-center gap-3">
          <span
              className="h-4 w-4 shrink-0 rounded-full"
              style={{
                  backgroundColor: topic.color,
              }}
          />

                    <h1 className="text-3xl font-semibold tracking-tight">
                        {topic.title}
                    </h1>
                </div>

                {topic.description && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {topic.description}
                    </p>
                )}

                <p className="text-sm text-zinc-500">
                    {words.length}{' '}
                    {words.length === 1 ? 'word' : 'words'}
                </p>
            </header>

            {words.length === 0 ? (
                <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
                    <p className="text-zinc-500">
                        No words in this topic yet.
                    </p>

                    <Link
                        href={`/vocabulary/${topic._id}/new`}
                        className="mt-4 inline-block text-sm font-medium underline"
                    >
                        Add the first word
                    </Link>
                </div>
            ) : (
                <ul className="flex flex-col gap-4">
                    {words.map((word) => (
                        <li
                            key={word._id.toString()}
                            className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <Link
                                        href={`/vocabulary/${topic._id}/${word._id}`}
                                        className="text-xl font-semibold hover:underline"
                                    >
                                        {word.word}
                                    </Link>

                                    {word.transcription && (
                                        <p className="mt-1 text-sm text-zinc-500">
                                            {word.transcription}
                                        </p>
                                    )}
                                </div>

                                <span className="shrink-0 rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  {word.level}
                </span>
                            </div>

                            <div className="mt-4 flex flex-col gap-4">
                                {word.meanings.map((meaning:WordMeaning, index: number) => (
                                    <div
                                        key={meaning._id?.toString() || index.toString()}
                                        className="border-l-2 border-zinc-200 pl-4 dark:border-zinc-700"
                                    >
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium">
                                                {meaning.translation}
                                            </p>

                                            {meaning.partOfSpeech !== 'other' && (
                                                <span className="text-xs text-zinc-400">
                          {meaning.partOfSpeech}
                        </span>
                                            )}
                                        </div>

                                        {meaning.example && (
                                            <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                                                {meaning.example}
                                            </p>
                                        )}

                                        {meaning.exampleTranslation && (
                                            <p className="mt-1 text-sm text-zinc-500">
                                                {meaning.exampleTranslation}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}