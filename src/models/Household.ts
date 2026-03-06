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
            required: false,
            trim: true,
        },
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


// Prevent model recompilation during hot reloads, but force update in development
if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.Household;
}
const Household: Model<IHousehold> = mongoose.models.Household || mongoose.model<IHousehold>('Household', HouseholdSchema);

export default Household;
