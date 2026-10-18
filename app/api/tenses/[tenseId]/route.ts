// app/api/tenses/[tenseId]/route.ts
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Tenses from "@/models/Tenses";

// GET /api/tenses/[tenseId] — Отримати один час
export async function GET(
    req: Request,
    { params }: { params: Promise<{ tenseId: string }> }
) {
    try {
        await connectToDatabase();
        const { tenseId } = await params;
        const tense = await Tenses.findById(tenseId);

        if (!tense) {
            return NextResponse.json({ error: 'Час не знайдено' }, { status: 404 });
        }

        return NextResponse.json(tense, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Помилка при отриманні' }, { status: 500 });
    }
}

// DELETE /api/tenses/[tenseId] — Видалити час
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ tenseId: string }> }
) {
    try {
        await connectToDatabase();
        const { tenseId } = await params;
        const deletedTense = await Tenses.findByIdAndDelete(tenseId);

        if (!deletedTense) {
            return NextResponse.json({ error: 'Час не знайдено' }, { status: 404 });
        }

        return NextResponse.json(
            { message: 'Час успішно видалено', id: tenseId },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ error: 'Помилка при видаленні' }, { status: 500 });
    }
}

// PATCH /api/tenses/[tenseId] — Оновити час
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ tenseId: string }> }
) {
    try {
        await connectToDatabase();
        const { tenseId } = await params;
        const updates = await req.json();

        const updatedTense = await Tenses.findByIdAndUpdate(tenseId, updates, {
            new: true,
            runValidators: true,
        });

        if (!updatedTense) {
            return NextResponse.json({ error: 'Час не знайдено' }, { status: 404 });
        }

        return NextResponse.json(updatedTense, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Помилка при оновленні' }, { status: 500 });
    }
}