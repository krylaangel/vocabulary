import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Word from '@/models/Word';

interface RouteParams {
    params: Promise<{
        wordId: string;
    }>;
}

// GET /api/words/[wordId] — Отримати одне слово
export async function GET(request: Request, { params }: RouteParams) {
    try {
        const { wordId } = await params;

        if (!mongoose.Types.ObjectId.isValid(wordId)) {
            return NextResponse.json({ error: 'Invalid Word ID' }, { status: 400 });
        }

        await connectToDatabase();

        const word = await Word.findById(wordId).populate('topics').lean();

        if (!word) {
            return NextResponse.json({ error: 'Word not found' }, { status: 404 });
        }

        return NextResponse.json(word, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Failed to fetch word', details: error.message },
            { status: 500 }
        );
    }
}

// PATCH /api/words/[wordId] — Оновити слово (або статуси/значення)
export async function PATCH(request: Request, { params }: RouteParams) {
    try {
        const { wordId } = await params;

        if (!mongoose.Types.ObjectId.isValid(wordId)) {
            return NextResponse.json({ error: 'Invalid Word ID' }, { status: 400 });
        }

        await connectToDatabase();
        const body = await request.json();

        const updatedWord = await Word.findByIdAndUpdate(
            wordId,
            { $set: body },
            { new: true, runValidators: true }
        ).populate('topics');

        if (!updatedWord) {
            return NextResponse.json({ error: 'Word not found' }, { status: 404 });
        }

        return NextResponse.json(updatedWord, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Failed to update word', details: error.message },
            { status: 400 }
        );
    }
}

// DELETE /api/words/[wordId] — Видалити слово
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const { wordId } = await params;

        if (!mongoose.Types.ObjectId.isValid(wordId)) {
            return NextResponse.json({ error: 'Invalid Word ID' }, { status: 400 });
        }

        await connectToDatabase();

        const deletedWord = await Word.findByIdAndDelete(wordId);

        if (!deletedWord) {
            return NextResponse.json({ error: 'Word not found' }, { status: 404 });
        }

        return NextResponse.json(
            { message: 'Word deleted successfully', id: wordId },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Failed to delete word', details: error.message },
            { status: 500 }
        );
    }
}