import { reverbService } from "./reverb.service";
import { ListingStatModel } from "../models/listing-stat.model";
import { IIngestBrand, IGuitarStats } from "../dto/statistic.dto";

class StatisticService {
    public async ingest(brands: IIngestBrand[]): Promise<number> {
        let count = 0;
        for (const { brand, models } of brands) {
            for (const guitarModel of models) {
                const listings = await reverbService.searchListings(`${brand} ${guitarModel}`, 10);
                for (const listing of listings) {
                    const price = parseFloat(listing.price?.amount ?? "0");
                    if (!price) continue;
                    await ListingStatModel.updateOne(
                        { listingId: String(listing.id) },
                        {
                            $setOnInsert: {
                                listingId: String(listing.id),
                                brand,
                                model: guitarModel,
                                title: listing.title ?? "",
                                price,
                                currency: listing.price?.currency ?? "USD",
                                condition: listing.condition?.display_name ?? "",
                                source: "Reverb",
                                ingestedAt: new Date(),
                            },
                        },
                        { upsert: true }
                    );
                    count++;
                }
            }
        }
        return count;
    }

    public async getStats(): Promise<IGuitarStats> {
        const [totalListings, byBrand, byCondition, topModels, latest] = await Promise.all([
            ListingStatModel.countDocuments(),
            ListingStatModel.aggregate([
                { $group: { _id: "$brand", count: { $sum: 1 }, avgPrice: { $avg: "$price" }, minPrice: { $min: "$price" }, maxPrice: { $max: "$price" } } },
                { $sort: { count: -1 } },
                { $project: { _id: 0, brand: "$_id", count: 1, avgPrice: { $round: ["$avgPrice", 2] }, minPrice: 1, maxPrice: 1 } },
            ]),
            ListingStatModel.aggregate([
                { $group: { _id: "$condition", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $project: { _id: 0, condition: "$_id", count: 1 } },
            ]),
            ListingStatModel.aggregate([
                { $group: { _id: { brand: "$brand", model: "$model" }, count: { $sum: 1 }, avgPrice: { $avg: "$price" } } },
                { $sort: { count: -1 } },
                { $limit: 10 },
                { $project: { _id: 0, brand: "$_id.brand", model: "$_id.model", count: 1, avgPrice: { $round: ["$avgPrice", 2] } } },
            ]),
            ListingStatModel.findOne().sort({ ingestedAt: -1 }).select("ingestedAt"),
        ]);

        return { totalListings, byBrand, byCondition, topModels, lastUpdated: latest?.ingestedAt ?? null };
    }
}

export const statisticService = new StatisticService();
