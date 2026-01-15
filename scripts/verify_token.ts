
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { expand } from 'dotenv-expand';
import path from 'path';

// Load env vars
const envPath = path.resolve(process.cwd(), '.env.local');
console.log(`📂 Loading .env from: ${envPath}`);
const envConfig = dotenv.config({ path: envPath });
expand(envConfig);

console.log(`🔧 Mongo URI status: ${process.env.MONGO_URI ? 'FOUND' : 'MISSING'}`);
if (envConfig.error) {
    console.error('⚠️ Dotenv error:', envConfig.error);
}

const TEST_TOKEN = '550e8400-e29b-41d4-a716-446655230000';

async function verifyToken() {
    console.log(`🔍 Verifying token: ${TEST_TOKEN}`);

    try {
        // Dynamic imports to ensure env vars are loaded first
        const { default: dbConnect } = await import('../src/lib/db');
        const { default: Household } = await import('../src/models/Household');

        await dbConnect();
        console.log('✅ DB Connected');

        // Simulate page.tsx logic
        const household = await Household.findOne({ inviteToken: TEST_TOKEN }).lean();

        if (household) {
            console.error('❌ CRITICAL: Found a household for this random token!');
            console.log(JSON.stringify(household, null, 2));
        } else {
            console.log('✅ VALID: No household found. The app WOULD redirect to /error.');
        }

        // Also check count of all households
        const count = await Household.countDocuments();
        console.log(`📊 Total Households in DB: ${count}`);

    } catch (error) {
        console.error('❌ Error during verification:', error);
    } finally {
        try {
            // Need to close connection nicely if possible, but mongoose might be stuck on global
            const { default: mongoose } = await import('mongoose');
            await mongoose.disconnect();
        } catch (e) {
            // ignore
        }
    }
}

verifyToken();
