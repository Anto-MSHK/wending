import mongoose, { Schema, Document, Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IGuest extends Document {
    guestName: string;
    gender: 'male' | 'female';
    inviteToken: string;
    isHeadOfHousehold: boolean;
    age?: number;
    isAttending: boolean | null;
    dietaryRestrictions?: string;
    householdId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const GuestSchema: Schema<IGuest> = new Schema(
    {
        guestName: {
            type: String,
            required: [true, 'Guest name is required'],
            trim: true,
        },
        gender: {
            type: String,
            enum: ['male', 'female'],
            required: [true, 'Gender is required'],
        },
        inviteToken: {
            type: String,
            required: true,
            unique: true,
            default: () => uuidv4(),
        },
        isHeadOfHousehold: {
            type: Boolean,
            default: false,
        },
        age: {
            type: Number,
            min: [0, 'Age cannot be negative'],
        },
        isAttending: {
            type: Boolean,
            default: null,
        },
        dietaryRestrictions: {
            type: String,
            trim: true,
        },
        householdId: {
            type: Schema.Types.ObjectId,
            ref: 'Household',
            required: [true, 'Household ID is required'],
        },
    },
    {
        timestamps: true,
        strictQuery: true,
    }
);



// Prevent model recompilation during hot reloads
const Guest: Model<IGuest> = mongoose.models.Guest || mongoose.model<IGuest>('Guest', GuestSchema);

export default Guest;
