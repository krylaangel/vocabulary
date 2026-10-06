import mongoose, { Schema } from 'mongoose';

const TopicSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            unique: true,
        },
        description: {
            type: String,
            trim: true,
            default: '',
        },
        color: {
            type: String,
            trim: true,
            default: '#3b82f6',
        },
        icon: {
            type: String,
            default: '📚',
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

const Topic = mongoose.models.Topic || mongoose.model('Topic', TopicSchema);

export default Topic;
