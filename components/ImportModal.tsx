'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ImportModalProps {
    apiEndpoint: string; // Наприклад: '/api/tenses' або '/api/words'
    title?: string;      // Заголовок модалки
    buttonText?: string; // Текст кнопки відкриття
}

export default function ImportModal({
                                        apiEndpoint,
                                        title = 'Імпорт з JSON',
                                        buttonText = '+ Імпорт JSON',
                                    }: ImportModalProps) {
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

            const res = await fetch(apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(arrayToImport),
            });

            if (!res.ok) {
                const data = (await res.json()) as { error?: string };
                throw new Error(data.error || 'Помилка при імпорті');
            }

            setIsOpen(false);
            setJsonText('');
            router.refresh();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Невалідний JSON';
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
                {buttonText}
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg dark:bg-zinc-900">
                <h2 className="mb-4 text-xl font-semibold">{title}</h2>

                <textarea
                    rows={10}
                    value={jsonText}
                    onChange={(e) => setJsonText(e.target.value)}
                    placeholder="Вставте JSON (об'єкт або масив)..."
                    className="w-full rounded-lg border border-zinc-300 p-3 font-mono text-xs outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:border-zinc-400"
                />

                {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

                <div className="mt-4 flex justify-end gap-3">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="rounded-lg border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700"
                    >
                        Скасувати
                    </button>
                    <button
                        onClick={handleImport}
                        disabled={loading}
                        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-zinc-900"
                    >
                        {loading ? 'Завантаження...' : 'Завантажити'}
                    </button>
                </div>
            </div>
        </div>
    );
}