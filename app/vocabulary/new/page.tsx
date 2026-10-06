'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewTopicPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [icon, setIcon] = useState('📚');

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {

    event.preventDefault();

    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          color,
          icon,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create topic');
        return;
      }

      router.push('/vocabulary');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="container-page">
      <header className="flex flex-col gap-2">
        <Link
          href="/vocabulary"
          className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          ← Back to vocabulary
        </Link>

        <h1 className="text-3xl font-semibold tracking-tight">
          New topic
        </h1>

        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Create a topic for your vocabulary.
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
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Travel"
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
            placeholder="Words related to travelling"
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
                placeholder="#3b82f6"
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
              placeholder="📚"
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
            href="/vocabulary"
            className="rounded-lg border border-zinc-300 px-5 py-3 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-900"
          >
            {isSubmitting ? 'Creating...' : 'Create topic'}
          </button>
        </div>
      </form>
    </main>
  );
}
