'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PART_OF_SPEECH, WORD_LEVELS, WordLevel, WordMeaning } from '@/types/vocabulary';

// Используем Omit, чтобы форма не требовала обязательный _id для нового значения
type MeaningForm = Omit<WordMeaning, '_id'>;

function createEmptyMeaning(): MeaningForm {
    return {
        translation: '',
        partOfSpeech: 'other',
        example: '',
        exampleTranslation: '',
    };
}

export default function NewWordPage() {
    const params = useParams<{ topicId: string }>();
    const router = useRouter();

    const topicId = params.topicId;

    const [word, setWord] = useState('');
    const [transcription, setTranscription] = useState('');
    const [level, setLevel] = useState<WordLevel>('B1');

    const [meanings, setMeanings] = useState<MeaningForm[]>([
        createEmptyMeaning(),
    ]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    function updateMeaning(
        index: number,
        field: keyof MeaningForm,
        value: string
    ) {
        setMeanings((current) =>
            current.map((meaning, meaningIndex) =>
                meaningIndex === index
                    ? {
                        ...meaning,
                        [field]: value,
                    }
                    : meaning
            )
        );
    }

    function addMeaning() {
        setMeanings((current) => [
            ...current,
            createEmptyMeaning(),
        ]);
    }

    function removeMeaning(index: number) {
        setMeanings((current) =>
            current.filter(
                (_, meaningIndex) => meaningIndex !== index
            )
        );
    }

    // Заменили React.SubmitEvent на React.FormEvent
    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError('');

        if (!word.trim()) {
            setError('Word is required');
            return;
        }

        const validMeanings = meanings.filter(
            (meaning) => meaning.translation.trim()
        );

        if (validMeanings.length === 0) {
            setError('At least one meaning is required');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/words', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    word,
                    transcription,
                    level,
                    meanings: validMeanings,
                    topics: [topicId],
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.error || 'Failed to create word'
                );
                return;
            }

            router.push(`/vocabulary/${topicId}`);
            router.refresh();
        } catch {
            setError(
                'Something went wrong. Please try again.'
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="container-page">
            <header className="flex flex-col gap-3">
                <Link
                    href={`/vocabulary/${topicId}`}
                    className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                    ← Back to topic
                </Link>

                <h1 className="text-3xl font-semibold tracking-tight">
                    New word
                </h1>

                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Add a new word to this topic.
                </p>
            </header>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-8"
            >
                <section className="flex flex-col gap-6">
                    <h2 className="text-lg font-semibold">
                        Word
                    </h2>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="word"
                                className="text-sm font-medium"
                            >
                                Word
                            </label>

                            <input
                                id="word"
                                type="text"
                                value={word}
                                onChange={(event) =>
                                    setWord(event.target.value)
                                }
                                placeholder="e.g. charge"
                                required
                                className="rounded-lg border border-zinc-300 bg-transparent px-4 py-3 outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:focus:border-zinc-400"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="transcription"
                                className="text-sm font-medium"
                            >
                                Transcription
                            </label>

                            <input
                                id="transcription"
                                type="text"
                                value={transcription}
                                onChange={(event) =>
                                    setTranscription(event.target.value)
                                }
                                placeholder="/tʃɑːrdʒ/"
                                className="rounded-lg border border-zinc-300 bg-transparent px-4 py-3 outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:focus:border-zinc-400"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:max-w-xs">
                        <label
                            htmlFor="level"
                            className="text-sm font-medium"
                        >
                            Level
                        </label>

                        <select
                            id="level"
                            value={level}
                            onChange={(event) =>
                                setLevel(
                                    event.target.value as WordLevel
                                )
                            }
                            className="rounded-lg border border-zinc-300 bg-transparent px-4 py-3 outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:focus:border-zinc-400"
                        >
                            {WORD_LEVELS.map((wordLevel) => (
                                <option
                                    key={wordLevel}
                                    value={wordLevel}
                                >
                                    {wordLevel}
                                </option>
                            ))}
                        </select>
                    </div>
                </section>

                <section className="flex flex-col gap-6">
                    <div className="flex items-center justify-between gap-4">
                        <h2 className="text-lg font-semibold">
                            Meanings
                        </h2>

                        <button
                            type="button"
                            onClick={addMeaning}
                            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
                        >
                            + Add meaning
                        </button>
                    </div>

                    <div className="flex flex-col gap-6">
                        {meanings.map((meaning, index) => (
                            <div
                                key={index}
                                className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800"
                            >
                                <div className="mb-5 flex items-center justify-between gap-4">
                                    <h3 className="font-medium">
                                        Meaning {index + 1}
                                    </h3>

                                    {meanings.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeMeaning(index)
                                            }
                                            className="text-sm text-red-500 hover:text-red-600"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>

                                <div className="flex flex-col gap-5">
                                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                        <div className="flex flex-col gap-2">
                                            <label
                                                htmlFor={`translation-${index}`}
                                                className="text-sm font-medium"
                                            >
                                                Translation
                                            </label>

                                            <input
                                                id={`translation-${index}`}
                                                type="text"
                                                value={meaning.translation}
                                                onChange={(event) =>
                                                    updateMeaning(
                                                        index,
                                                        'translation',
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="заряжать"
                                                required
                                                className="rounded-lg border border-zinc-300 bg-transparent px-4 py-3 outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:focus:border-zinc-400"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label
                                                htmlFor={`partOfSpeech-${index}`}
                                                className="text-sm font-medium"
                                            >
                                                Part of speech
                                            </label>

                                            <select
                                                id={`partOfSpeech-${index}`}
                                                value={meaning.partOfSpeech}
                                                onChange={(event) =>
                                                    updateMeaning(
                                                        index,
                                                        'partOfSpeech',
                                                        event.target.value
                                                    )
                                                }
                                                className="rounded-lg border border-zinc-300 bg-transparent px-4 py-3 outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:focus:border-zinc-400"
                                            >
                                                {PART_OF_SPEECH.map(
                                                    (partOfSpeech) => (
                                                        <option
                                                            key={partOfSpeech}
                                                            value={partOfSpeech}
                                                        >
                                                            {partOfSpeech}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label
                                            htmlFor={`example-${index}`}
                                            className="text-sm font-medium"
                                        >
                                            Example
                                        </label>

                                        <input
                                            id={`example-${index}`}
                                            type="text"
                                            value={meaning.example}
                                            onChange={(event) =>
                                                updateMeaning(
                                                    index,
                                                    'example',
                                                    event.target.value
                                                )
                                            }
                                            placeholder="I need to charge my phone."
                                            className="rounded-lg border border-zinc-300 bg-transparent px-4 py-3 outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:focus:border-zinc-400"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label
                                            htmlFor={`exampleTranslation-${index}`}
                                            className="text-sm font-medium"
                                        >
                                            Example translation
                                        </label>

                                        <input
                                            id={`exampleTranslation-${index}`}
                                            type="text"
                                            value={meaning.exampleTranslation}
                                            onChange={(event) =>
                                                updateMeaning(
                                                    index,
                                                    'exampleTranslation',
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Мне нужно зарядить телефон."
                                            className="rounded-lg border border-zinc-300 bg-transparent px-4 py-3 outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:focus:border-zinc-400"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
                        {error}
                    </div>
                )}

                <div className="flex gap-3">
                    <Link
                        href={`/vocabulary/${topicId}`}
                        className="rounded-lg border border-zinc-300 px-5 py-3 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-lg bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-900"
                    >
                        {isSubmitting
                            ? 'Creating...'
                            : 'Create word'}
                    </button>
                </div>
            </form>
        </main>
    );
}