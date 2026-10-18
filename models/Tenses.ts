// models/Rule.ts
import mongoose, { Schema, model, models } from 'mongoose';

export interface ITenses {
    title: string;         // Наприклад: "Present Simple"
    group: string;         // "Present", "Past", "Future"
    structure: {
        positive: string;    // Наприклад: "Subject + V1 (s/es)"
        negative: string;    // Наприклад: "Subject + do/does not + V1"
        question: string;    // Наприклад: "Do/Does + Subject + V1?"
    };
    usage: string[];       // Для чого використовується (наприклад: "Habits", "General facts")
    timeSignals: string[]; // Слова-маркери: ["always", "usually", "every day"]
    examples: string[];    // Приклади речень
    createdAt?: Date;
}

const TensesSchema = new Schema<ITenses>(
    {
        title: { type: String, required: true },
        group: { type: String, required: true, enum: ['Present', 'Past', 'Future'] },
        structure: {
            positive: { type: String, required: true },
            negative: { type: String, required: true },
            question: { type: String, required: true },
        },
        usage: [{ type: String }],
        timeSignals: [{ type: String }],
        examples: [{ type: String }],
    },
    { timestamps: true }
);

export default models.Tenses || model<ITenses>('Tenses', TensesSchema);