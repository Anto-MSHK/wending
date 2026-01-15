import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHousehold extends Document {
    householdName: string;
    addressLine?: string;
    city?: string;
    telegramUsername?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const HouseholdSchema: Schema<IHousehold> = new Schema(
    {
        householdName: {
            type: String,
            required: [true, 'Household name is required'],
            trim: true,
        },
        // inviteToken moved to Guest model

        addressLine: {
            type: String,
            trim: true,
        },
        city: {
            type: String,
            trim: true,
        },
        telegramUsername: {
            type: String,
            trim: true,
        },
        notes: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
        strictQuery: true,
    }
);

// Create index on inviteToken for fast lookups
HouseholdSchema.index({ inviteToken: 1 });

// Prevent model recompilation during hot reloads
const Household: Model<IHousehold> = mongoose.models.Household || mongoose.model<IHousehold>('Household', HouseholdSchema);

export default Household;
