import { Document, model, Schema } from "mongoose";

export interface IListingStat extends Document {
    listingId: string;
    brand: string;
    model: string;
    title: string;
    price: number;
    currency: string;
    condition: string;
    source: string;
    ingestedAt: Date;
}

const ListingStatSchema = new Schema<IListingStat>({
    listingId: { type: String, required: true, unique: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    condition: { type: String, default: "" },
    source: { type: String, default: "Reverb" },
    ingestedAt: { type: Date, default: () => new Date() },
});

export const ListingStatModel = model<IListingStat>(
    "ListingStatModel",
    ListingStatSchema,
    "listing-stats"
);
