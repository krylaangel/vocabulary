'use client';

import Link from 'next/link';
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';

interface Structure {
    positive: string;
    negative: string;
    question: string;
}

interface Tense {
    _id: string;
    title: string;
    group: 'Present' | 'Past' | 'Future';
    description?: string;
    color?: string;
    structure?: Structure;
    timeSignals?: string[];
    examples?: string[];
}

interface EditTensePageProps {
    params: Promise<{
        tenseId: string;
    }>;
}

export default function EditTensePage({ params }: EditTensePageProps) {
    const { tenseId } = use(params);
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [group, setGroup] = useState<'Present' | 'Past' | 'Future'>('Present');
    const [color, setColor] = useState('#3b82f6');
    const [description, setDescription] = useState('');

    // Structure
    const [positive, setPositive] = useState('');
    const [negative, setNegative] = useState('');
    const [question, setQuestion] = useState('');

    // Array fields as comma-separated text in form
    const [timeSignals, setTimeSignals] = useState('');
    const [examples, setExamples] = useState('');

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Загрузка существующих данных времени
    useEffect(() => {
        async function fetchTense() {
            try {
                const response = await fetch(`/api/tenses/${tenseId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch tense');
                }
                const data: Tense = await response.json();

                setTitle(data.title || '');
                setGroup(data.group || 'Present');
                setColor(data.color || '#3b82f6');
                setDescription(data.description || '');

                setPositive(data.structure?.positive || '');
                setNegative(data.structure?.negative || '');
                setQuestion(data.structure?.question || '');

                setTimeSignals(data.timeSignals ? data.timeSignals.join(', ') : '');
                setExamples(data.examples ? data.examples.join('\n') : '');
            } catch {
                setError('Could not load tense data');
            } finally {
                setIsLoading(false);
            }
        }

        fetchTense();
    }, [tenseId]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');

        if (!title.trim()) {
            setError('Title is required');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/tenses/${tenseId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    group,
                    color,
                    description,
                    structure: {
                        positive,
                        negative,
                        question,
                    },
                    timeSignals: timeSignals
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    examples: examples
                        .split('\n')
                        .map((ex) => ex.trim())
                        .filter(Boolean),
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.error || 'Failed to update tense');
                return;
            }

            router.push('/tenses');
            router.refresh();
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) {
        return (
            <main className="container-page">
                <p className="text-zinc-500">Loading tense...</p>
            </main>
        );
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

                <h1 className="text-3xl font-semibold tracking-tight">
                    Edit tense
                </h1>
            </header>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                {/* General Information */}
                <section className="flex flex-col gap-6">
                    <h2 className="text-lg font-semibold">Tense Details</h2>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="title" className="text-sm font-medium">
                                Title
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="rounded-lg border border-zinc-300 bg-transparent px-4 py-3 outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:focus:border-zinc-400"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="group" className="text-sm font-medium">
                                Group
                            </label>
                            <select
                                id="group"
                                value={group}
                                onChange={(e) => setGroup(e.target.value as 'Present' | 'Past' | 'Future')}
                                className="rounded-lg border border-zinc-300 bg-transparent px-4 py-3 outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:focus:border-zinc-400"
                            >
                                <option value="Present">Present</option>
                                <option value="Past">Past</option>
                                <option value="Future">Future</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="color" className="text-sm font-medium">
                                Color (HEX)
                            </label>
                            <div className="flex gap-3">
                                <input
                                    id="color"
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="h-12 w-16 cursor-pointer rounded-lg border border-zinc-300 bg-transparent p-1 dark:border-zinc-700"
                                />
                                <input
                                    type="text"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="flex-1 rounded-lg border border-zinc-300 bg-transparent px-4 py-3 outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:focus:border-zinc-400"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="description" className="text-sm font-medium">
                                Description
                            </label>
                            <input
                                id="description"
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="rounded-lg border border-zinc-300 bg-transparent px-4 py-3 outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:focus:border-zinc-400"
                            />
                        </div>
                    </div>
                </section>

                {/* Grammar Structures */}
                <section className="flex flex-col gap-6">
                    <h2 className="text-lg font-semibold">Structure Formulas</h2>

                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="positive" className="text-sm font-medium">
                                Positive (+)
                            </label>
                            <input
                                id="positive"
                                type="text"
                                value={positive}
                                onChange={(e) => setPositive(e.target.value)}
                                placeholder="e.g. Subject + V1 (s/es)"
                                className="rounded-lg border border-zinc-300 bg-transparent px-4 py-3 outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:focus:border-zinc-400"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="negative" className="text-sm font-medium">
                                Negative (-)
                            </label>
                            <input
                                id="negative"
                                type="text"
                                value={negative}
                                onChange={(e) => setNegative(e.target.value)}
                                placeholder="e.g. Subject + do/does not + V1"
                                className="rounded-lg border border-zinc-300 bg-transparent px-4 py-3 outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:focus:border-zinc-400"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="question" className="text-sm font-medium">
                                Question (?)
                            </label>
                            <input
                                id="question"
                                type="text"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="e.g. Do/Does + Subject + V1?"
                                className="rounded-lg border border-zinc-300 bg-transparent px-4 py-3 outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:focus:border-zinc-400"
                            />
                        </div>
                    </div>
                </section>

                {/* Time Signals & Examples */}
                <section className="flex flex-col gap-6">
                    <h2 className="text-lg font-semibold">Markers & Examples</h2>

                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="timeSignals" className="text-sm font-medium">
                                Time signals (comma separated)
                            </label>
                            <input
                                id="timeSignals"
                                type="text"
                                value={timeSignals}
                                onChange={(e) => setTimeSignals(e.target.value)}
                                placeholder="e.g. always, usually, every day"
                                className="rounded-lg border border-zinc-300 bg-transparent px-4 py-3 outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:focus:border-zinc-400"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="examples" className="text-sm font-medium">
                                Examples (one per line)
                            </label>
                            <textarea
                                id="examples"
                                rows={4}
                                value={examples}
                                onChange={(e) => setExamples(e.target.value)}
                                placeholder="I play football every Sunday.&#10;She works in a bank."
                                className="rounded-lg border border-zinc-300 bg-transparent px-4 py-3 outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:focus:border-zinc-400"
                            />
                        </div>
                    </div>
                </section>

                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
                        {error}
                    </div>
                )}

                <div className="flex gap-3">
                    <Link
                        href="/tenses"
                        className="rounded-lg border border-zinc-300 px-5 py-3 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-lg bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-900"
                    >
                        {isSubmitting ? 'Saving...' : 'Save changes'}
                    </button>
                </div>
            </form>
        </main>
    );
}