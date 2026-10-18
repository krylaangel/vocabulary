// app/api/tenses/route.ts
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Tenses from "@/models/Tenses";

// GET /api/tenses — Отримати всі часи
export async function GET() {
    try {
        await connectToDatabase();
        const tenses = await Tenses.find({}).sort({ createdAt: -1 });
        return NextResponse.json(tenses, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch tenses' },
            { status: 500 }
        );
    }
}

// POST /api/tenses — Створити ОДИН або МАСИВ часів
export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const body = await req.json();

        // Якщо відправили масив: [{ title: "..." }, { title: "..." }]
        if (Array.isArray(body)) {
            if (body.length === 0) {
                return NextResponse.json(
                    { error: 'Array cannot be empty' },
                    { status: 400 }
                );
            }

            const newTenses = await Tenses.insertMany(body);
            return NextResponse.json(newTenses, { status: 201 });
        }

        // Якщо відправили один об'єкт: { title: "..." }
        if (!body.title) {
            return NextResponse.json(
                { error: 'Title is required' },
                { status: 400 }
            );
        }

        const newTense = await Tenses.create(body);
        return NextResponse.json(newTense, { status: 201 });

    } catch (error) {
        console.error('POST Error:', error);
        return NextResponse.json(
            { error: 'Failed to create tense(s)' },
            { status: 500 }
        );
    }
}