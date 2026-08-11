import { Document, model, Schema, Types } from "mongoose";

export interface IFollowedListing extends Document {
    userId: Types.ObjectId;
    listingId: string;
    title: string;
    price: { amount: string; currency: string };
    condition: string;
    imageUrl: string;
    reverbUrl: string;
    followedAt: Date;
}

const FollowedListingSchema = new Schema<IFollowedListing>({
    userId: { type: Schema.Types.ObjectId, ref: "UserModel", required: true },
    listingId: { type: String, required: true },
    title: { type: String, required: true },
    price: {
        amount: { type: String, default: "" },
        currency: { type: String, default: "" },
    },
    condition: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    reverbUrl: { type: String, default: "" },
    followedAt: { type: Date, default: () => new Date() },
});

FollowedListingSchema.index({ userId: 1, listingId: 1 }, { unique: true });

export const FollowedListingModel = model<IFollowedListing>(
    "FollowedListingModel",
    FollowedListingSchema,
    "followed-listings"
);
