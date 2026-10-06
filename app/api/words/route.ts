import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Word from '@/models/Word';
import { CreateWordInput } from '@/types/vocabulary';

type WordFilter = {
    topics?: string;
    status?: string;
    level?: string;
    word?: { $regex: string; $options: string };
};

export async function GET(request: Request) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(request.url);
        const topicId = searchParams.get('topicId');
        const status = searchParams.get('status');
        const level = searchParams.get('level');
        const search = searchParams.get('search');

        const filter: WordFilter = {};

        if (topicId) filter.topics = topicId;
        if (status) filter.status = status;
        if (level) filter.level = level;
        if (search) {
            filter.word = { $regex: search, $options: 'i' };
        }

        const words = await Word.find(filter)
            .populate('topics', 'title color icon')
            .sort({ createdAt: -1 })
            .lean();

        const total = await Word.countDocuments(filter);

        return NextResponse.json({ words, total }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        return NextResponse.json(
            { error: 'Failed to fetch words', details: errorMessage },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const body: CreateWordInput | CreateWordInput[] = await request.json();

        // 1. Обработка массива (массовый импорт)
        if (Array.isArray(body)) {
            if (body.length === 0) {
                return NextResponse.json(
                    { error: 'Array cannot be empty' },
                    { status: 400 }
                );
            }

            // Валидация каждого элемента массива
            const isValid = body.every(
                (item) => item.word && item.meanings && item.meanings.length > 0
            );

            if (!isValid) {
                return NextResponse.json(
                    { error: 'Each word must have a word title and at least one meaning' },
                    { status: 400 }
                );
            }

            const newWords = await Word.insertMany(body);
            return NextResponse.json(newWords, { status: 201 });
        }

        // 2. Обработка одиночного объекта
        if (!body.word || !body.meanings || body.meanings.length === 0) {
            return NextResponse.json(
                { error: 'Word and at least one meaning are required' },
                { status: 400 }
            );
        }

        const newWord = await Word.create(body);
        return NextResponse.json(newWord, { status: 201 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        return NextResponse.json(
            { error: 'Failed to create word(s)', details: errorMessage },
            { status: 400 }
        );
    }
}