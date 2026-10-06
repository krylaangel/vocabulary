'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ImportWordsModal({ topicId }: { topicId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [jsonText, setJsonText] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleImport() {
        setError('');
        setLoading(true);

        try {
            const parsed: unknown = JSON.parse(jsonText);
            const arrayToImport = Array.isArray(parsed) ? parsed : [parsed];

            const wordsWithTopic = arrayToImport.map((item) => {
                if (typeof item === 'object' && item !== null) {
                    const record = item as Record<string, unknown>;
                    return {
                        ...record,
                        topics: record.topics || [topicId],
                    };
                }
                return item;
            });

            const res = await fetch('/api/words', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(wordsWithTopic),
            });

            if (!res.ok) {
                const data = (await res.json()) as { error?: string };
                throw new Error(data.error || 'Ошибка при импорте');
            }

            setIsOpen(false);
            setJsonText('');
            router.refresh();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Невалидный JSON';
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
                + Импорт JSON
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg dark:bg-zinc-900">
                <h2 className="mb-4 text-xl font-semibold">Импорт слов из JSON</h2>

                <textarea
                    rows={10}
                    value={jsonText}
                    onChange={(e) => setJsonText(e.target.value)}
                    placeholder="Вставьте JSON массив со словами..."
                    className="w-full rounded-lg border border-zinc-300 p-3 font-mono text-xs dark:border-zinc-700 dark:bg-zinc-800"
                />

                {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

                <div className="mt-4 flex justify-end gap-3">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="rounded-lg border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={handleImport}
                        disabled={loading}
                        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 dark:bg-white dark:text-zinc-900"
                    >
                        {loading ? 'Загрузка...' : 'Загрузить'}
                    </button>
                </div>
            </div>
        </div>
    );
}