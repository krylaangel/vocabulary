import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Topic from '@/models/Topic';
import type { CreateTopicInput, TopicsResponse } from '@/types/vocabulary';

const DEFAULT_COLOR = '#3b82f6';
const DEFAULT_ICON = '📚';

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

export async function GET() {
    try {
        await connectToDatabase();

        const topics = await Topic.find({}).sort({ createdAt: -1 }).lean();

        return NextResponse.json({ topics } satisfies TopicsResponse);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load topics';

        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as CreateTopicInput;

        if (!body.title?.trim()) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }

        await connectToDatabase();

        const exists = await Topic.findOne({ title: body.title.trim() }).lean();

        if (exists) {
            return NextResponse.json(
                { error: 'Topic with this title already exists' },
                { status: 409 }
            );
        }

        const color = body.color?.trim();

        const topic = await Topic.create({
            title: body.title.trim(),
            description: body.description?.trim() ?? '',
            color: color && HEX_COLOR.test(color) ? color : DEFAULT_COLOR,
            icon: body.icon?.trim() || DEFAULT_ICON,
        });

        return NextResponse.json({ topic }, { status: 201 });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : 'Failed to create topic';

        return NextResponse.json({ error: message }, { status: 500 });
    }
}
