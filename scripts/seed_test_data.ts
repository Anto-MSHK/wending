
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { expand } from 'dotenv-expand';
import path from 'path';

// Load env vars
const envPath = path.resolve(process.cwd(), '.env.local');
const envConfig = dotenv.config({ path: envPath });
expand(envConfig);

if (!process.env.MONGO_URI && process.env.MONGODB_URI) {
    process.env.MONGO_URI = process.env.MONGODB_URI;
}

const SEED_HOUSEHOLD_NAME = "Test Family";
const ADMIN_NAME = "Anton (Admin)";
const PARTNER_NAME = "Elena (Partner)";

async function seedData() {
    console.log('🌱 Seeding Guest-First data...');

    try {
        const { default: dbConnect } = await import('../src/lib/db');
        const { default: Household } = await import('../src/models/Household');
        const { default: Guest } = await import('../src/models/Guest');

        await dbConnect();

        // 1. Create/Find Household
        let household = await Household.findOne({ householdName: SEED_HOUSEHOLD_NAME });

        if (!household) {
            console.log('Creating new household...');
            household = await Household.create({
                householdName: SEED_HOUSEHOLD_NAME,
                // inviteToken removed
            });
        } else {
            console.log('Using existing household...');
        }

        // 2. Create Admin Guest (Head of Household)
        let adminGuest = await Guest.findOne({
            householdId: household._id,
            guestName: ADMIN_NAME
        });

        if (!adminGuest) {
            adminGuest = await Guest.create({
                guestName: ADMIN_NAME,
                gender: 'male',
                householdId: household._id,
                isAttending: null,
                isHeadOfHousehold: true, // Key flag
                // inviteToken generated automatically
            });
            console.log('Created Admin Guest.');
        } else {
            // Ensure token exists if sparse
            if (!adminGuest.inviteToken) {
                adminGuest.inviteToken = (await import('uuid')).v4();
                await adminGuest.save();
            }
            console.log('Admin Guest exists.');
        }

        // 3. Create Partner (Regular Guest)
        let partnerGuest = await Guest.findOne({
            householdId: household._id,
            guestName: PARTNER_NAME
        });

        if (!partnerGuest) {
            partnerGuest = await Guest.create({
                guestName: PARTNER_NAME,
                gender: 'female',
                householdId: household._id,
                isAttending: null,
                isHeadOfHousehold: false
            });
            console.log('Created Partner Guest.');
        }

        console.log('\n✅ SEED COMPLETE (Guest-First Model)');
        console.log('-------------------------------------------');
        console.log(`🏠 Household: ${household.householdName}`);
        console.log(`👤 Guest (Admin): ${adminGuest.guestName} [HEAD]`);
        console.log(`🔑 Token:     ${adminGuest.inviteToken}`);
        console.log(`🔗 Link:      http://localhost:3000/?token=${adminGuest.inviteToken}`);
        console.log('-------------------------------------------');
        console.log(`👤 Guest (Partner): ${partnerGuest?.guestName}`);
        console.log(`🔑 Token:     ${partnerGuest?.inviteToken}`);
        console.log('-------------------------------------------');

    } catch (error) {
        console.error('❌ Error seeding data:', error);
    } finally {
        const { default: mongoose } = await import('mongoose');
        await mongoose.disconnect();
    }
}

seedData();
