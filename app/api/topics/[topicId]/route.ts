import { NextResponse } from 'next/server';

import connectToDatabase from '@/lib/mongodb';
import Topic from '@/models/Topic';

const DEFAULT_COLOR = '#3b82f6';
const DEFAULT_ICON = '📚';

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

interface RouteContext {
    params: Promise<{
        topicId: string;
    }>;
}

export async function GET(
    request: Request,
    { params }: RouteContext
) {
    try {
        const { topicId } = await params;

        await connectToDatabase();

        const topic = await Topic.findById(topicId).lean();

        if (!topic) {
            return NextResponse.json(
                { error: 'Topic not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ topic });
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : 'Failed to load topic';

        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: RouteContext
) {
    try {
        const { topicId } = await params;

        const body = await request.json();

        if (!body.title?.trim()) {
            return NextResponse.json(
                { error: 'Title is required' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const title = body.title.trim();

        const exists = await Topic.findOne({
            title,
            _id: { $ne: topicId },
        }).lean();

        if (exists) {
            return NextResponse.json(
                { error: 'Topic with this title already exists' },
                { status: 409 }
            );
        }

        const color = body.color?.trim();

        const topic = await Topic.findByIdAndUpdate(
            topicId,
            {
                title,
                description: body.description?.trim() ?? '',
                color:
                    color && HEX_COLOR.test(color)
                        ? color
                        : DEFAULT_COLOR,
                icon: body.icon?.trim() || DEFAULT_ICON,
            },
            {
                new: true,
                runValidators: true,
            }
        ).lean();

        if (!topic) {
            return NextResponse.json(
                { error: 'Topic not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ topic });
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : 'Failed to update topic';

        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: RouteContext
) {
    try {
        const { topicId } = await params;

        await connectToDatabase();

        const topic = await Topic.findByIdAndDelete(topicId);

        if (!topic) {
            return NextResponse.json(
                { error: 'Topic not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Topic deleted successfully',
        });
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : 'Failed to delete topic';

        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}