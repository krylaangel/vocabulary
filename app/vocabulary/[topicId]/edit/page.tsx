'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Topic {
    _id: string;
    title: string;
    description: string;
    color: string;
    icon: string;
}

export default function EditTopicPage() {
    const params = useParams<{ topicId: string }>();
    const router = useRouter();

    const topicId = params.topicId;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('#3b82f6');
    const [icon, setIcon] = useState('📚');

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadTopic() {
            try {
                const response = await fetch(
                    `/api/topics/${topicId}`
                );

                const data = await response.json();

                if (!response.ok) {
                    setError(data.error || 'Failed to load topic');
                    return;
                }

                const topic: Topic = data.topic;

                setTitle(topic.title);
                setDescription(topic.description);
                setColor(topic.color);
                setIcon(topic.icon);
            } catch {
                setError('Failed to load topic');
            } finally {
                setIsLoading(false);
            }
        }

        loadTopic();
    }, [topicId]);

    async function handleSubmit(
        event: React.SubmitEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError('');
        setIsSubmitting(true);

        try {
            const response = await fetch(
                `/api/topics/${topicId}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title,
                        description,
                        color,
                        icon,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Failed to update topic');
                return;
            }

            router.push(`/vocabulary/${topicId}`);
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
                <p className="text-sm text-zinc-500">
                    Loading topic...
                </p>
            </main>
        );
    }

    if (error && !title) {
        return (
            <main className="container-page">
                <Link
                    href="/vocabulary"
                    className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                    ← Back to vocabulary
                </Link>

                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
                    {error}
                </div>
            </main>
        );
    }

    return (
        <main className="container-page">
            <header className="flex flex-col gap-2">
                <Link
                    href={`/vocabulary/${topicId}`}
                    className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                    ← Back to topic
                </Link>

                <h1 className="text-3xl font-semibold tracking-tight">
                    Edit topic
                </h1>

                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Update the topic information.
                </p>
            </header>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6"
            >
                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="title"
                        className="text-sm font-medium"
                    >
                        Title
                    </label>

                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(event) =>
                            setTitle(event.target.value)
                        }
                        required
                        className="rounded-lg border border-zinc-300 bg-transparent px-4 py-3 outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:focus:border-zinc-400"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="description"
                        className="text-sm font-medium"
                    >
                        Description
                    </label>

                    <textarea
                        id="description"
                        value={description}
                        onChange={(event) =>
                            setDescription(event.target.value)
                        }
                        rows={4}
                        className="resize-none rounded-lg border border-zinc-300 bg-transparent px-4 py-3 outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:focus:border-zinc-400"
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="color"
                            className="text-sm font-medium"
                        >
                            Color
                        </label>

                        <div className="flex gap-3">
                            <input
                                id="color"
                                type="color"
                                value={color}
                                onChange={(event) =>
                                    setColor(event.target.value)
                                }
                                className="h-12 w-14 cursor-pointer rounded-lg border border-zinc-300 bg-transparent p-1 dark:border-zinc-700"
                            />

                            <input
                                type="text"
                                value={color}
                                onChange={(event) =>
                                    setColor(event.target.value)
                                }
                                className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-transparent px-4 py-3 outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:focus:border-zinc-400"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="icon"
                            className="text-sm font-medium"
                        >
                            Icon
                        </label>

                        <input
                            id="icon"
                            type="text"
                            value={icon}
                            onChange={(event) =>
                                setIcon(event.target.value)
                            }
                            maxLength={10}
                            className="rounded-lg border border-zinc-300 bg-transparent px-4 py-3 outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:focus:border-zinc-400"
                        />
                    </div>
                </div>

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
                        {isSubmitting ? 'Saving...' : 'Save changes'}
                    </button>
                </div>
            </form>
        </main>
    );
}