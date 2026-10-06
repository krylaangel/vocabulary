// src/models/Word.ts

import { Schema, model, models } from 'mongoose';

const wordMeaningSchema = new Schema(
    {
        translation: {
            type: String,
            required: true,
            trim: true,
        },

        partOfSpeech: {
            type: String,
            enum: [
                'noun',
                'verb',
                'adjective',
                'adverb',
                'pronoun',
                'preposition',
                'conjunction',
                'phrase',
                'other',
            ],
            default: 'other',
        },

        example: {
            type: String,
            default: '',
            trim: true,
        },

        exampleTranslation: {
            type: String,
            default: '',
            trim: true,
        },
    },
    {
        _id: true,
    }
);

const wordSchema = new Schema(
    {
        word: {
            type: String,
            required: true,
            trim: true,
        },

        transcription: {
            type: String,
            default: '',
            trim: true,
        },

        meanings: {
            type: [wordMeaningSchema],
            required: true,
            validate: {
                validator: (meanings: unknown[]) => meanings.length > 0,
                message: 'At least one meaning is required',
            },
        },

        level: {
            type: String,
            enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
            default: 'B1',
        },

        topics: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Topic',
            },
        ],

        isFavorite: {
            type: Boolean,
            default: false,
        },

        status: {
            type: String,
            enum: ['new', 'learning', 'known'],
            default: 'new',
        },
    },
    {
        timestamps: true,
    }
);

const Word = models.Word || model('Word', wordSchema);

export default Word;