import mongoose, { Schema, Document, Model } from 'mongoose';

export type MenuChoice = 'meat' | 'fish' | 'vegetarian' | 'kids' | null;
export type AllergenType = 'nuts' | 'seafood' | 'gluten' | 'lactose';
export type AlcoholPreference = 'wine' | 'champagne' | 'spirits' | 'none';

export interface IGuestQuestionnaire extends Document {
    guestId: mongoose.Types.ObjectId;
    menuChoice: MenuChoice;
    allergies: AllergenType[];
    allergiesOther: string;
    hasNoAllergies: boolean;
    alcoholPreferences: AlcoholPreference[];
    needsTransfer: boolean | null;
    createdAt: Date;
    updatedAt: Date;
}

const GuestQuestionnaireSchema: Schema<IGuestQuestionnaire> = new Schema(
    {
        guestId: {
            type: Schema.Types.ObjectId,
            ref: 'Guest',
            required: [true, 'Guest ID is required'],
            unique: true,
        },
        menuChoice: {
            type: String,
            enum: ['meat', 'fish', 'vegetarian', 'kids', null],
            default: null,
        },
        allergies: {
            type: [String],
            enum: ['nuts', 'seafood', 'gluten', 'lactose'],
            default: [],
        },
        allergiesOther: {
            type: String,
            trim: true,
            default: '',
        },
        hasNoAllergies: {
            type: Boolean,
            default: false,
        },
        alcoholPreferences: {
            type: [String],
            enum: ['wine', 'champagne', 'spirits', 'none'],
            default: [],
        },
        needsTransfer: {
            type: Boolean,
            default: null,
        },
    },
    {
        timestamps: true,
        strictQuery: true,
    }
);

// Index for fast guest lookups
GuestQuestionnaireSchema.index({ guestId: 1 });

// Prevent model recompilation during hot reloads
const GuestQuestionnaire: Model<IGuestQuestionnaire> =
    mongoose.models.GuestQuestionnaire ||
    mongoose.model<IGuestQuestionnaire>('GuestQuestionnaire', GuestQuestionnaireSchema);

export default GuestQuestionnaire;
