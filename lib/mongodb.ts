import mongoose from 'mongoose';
import dns from 'node:dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);
const MONGODB_URI = process.env.MONGODB_URI;

export default async function connectToDatabase() {
    if (!MONGODB_URI) {
        throw new Error(
            'Please define the MONGODB_URI environment variable'
        );
    }

    await mongoose.connect(MONGODB_URI);

    return mongoose;
}