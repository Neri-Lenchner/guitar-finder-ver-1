import { Document, model, Schema } from "mongoose";

export interface IListingStat extends Document {
    listingId: string;
    brand: string;
    guitarModel: string;
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
    guitarModel: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    condition: { type: String, default: "" },
    source: { type: String, default: "Reverb" },
    ingestedAt: { type: Date, default: () => new Date() },
});

ListingStatSchema.index({ brand: 1 });
ListingStatSchema.index({ condition: 1 });
ListingStatSchema.index({ brand: 1, guitarModel: 1 });
ListingStatSchema.index({ price: 1 });
ListingStatSchema.index({ ingestedAt: -1 });

export const ListingStatModel = model<IListingStat>(
    "ListingStatModel",
    ListingStatSchema,
    "listing-stats"
);
