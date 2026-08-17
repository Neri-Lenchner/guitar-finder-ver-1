import { reverbService } from "./reverb.service";
import { ListingStatModel } from "../models/listing-stat.model";
import { IIngestBrand, IGuitarStats } from "../dto/statistic.dto";

const STATS_TTL = 10 * 60 * 1000;

class StatisticService {
    private statsCache: { data: IGuitarStats; ts: number } | null = null;

    public async ingest(brands: IIngestBrand[]): Promise<{ count: number; matched: number }> {
        this.statsCache = null;
        let count = 0;
        let matched = 0;
        for (let i = 0; i < brands.length; i += 10) {
            const chunk = brands.slice(i, i + 10);
            const results = await Promise.all(
                chunk.map(({ brand, models }) =>
                    reverbService.searchListings(brand, 50).then(listings => ({ brand, models, listings }))
                )
            );
            for (const { brand, models, listings } of results) {
                const ops = listings.flatMap(listing => {
                    const price = parseFloat(listing.price?.amount ?? "0");
                    if (!price) return [];
                    const title: string = listing.title ?? "";
                    const guitarModel: string = models.find(m => title.toLowerCase().includes(m.toLowerCase())) ?? "";
                    if (guitarModel) matched++;
                    count++;
                    return [{
                        updateOne: {
                            filter: { listingId: String(listing.id) },
                            update: {
                                $set: { guitarModel },
                                $setOnInsert: {
                                    listingId: String(listing.id),
                                    brand,
                                    title,
                                    price,
                                    currency: listing.price?.currency ?? "USD",
                                    condition: listing.condition?.display_name ?? "",
                                    source: "Reverb",
                                    ingestedAt: new Date(),
                                },
                            },
                            upsert: true,
                        },
                    }];
                });
                if (ops.length) await ListingStatModel.bulkWrite(ops, { ordered: false });
            }
        }
        return { count, matched };
    }

    public async getStats(): Promise<IGuitarStats> {
        if (this.statsCache && Date.now() - this.statsCache.ts < STATS_TTL) {
            return this.statsCache.data;
        }

        const [byBrand, byCondition, topModels, priceHistogram, byBrandAndCondition, latest] = await Promise.all([
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
                { $match: { guitarModel: { $ne: "" } } },
                { $group: { _id: { brand: "$brand", guitarModel: "$guitarModel" }, count: { $sum: 1 }, avgPrice: { $avg: "$price" } } },
                { $sort: { count: -1 } },
                { $limit: 10 },
                { $project: { _id: 0, brand: "$_id.brand", model: "$_id.guitarModel", count: 1, avgPrice: { $round: ["$avgPrice", 2] } } },
            ]),
            ListingStatModel.aggregate([
                {
                    $bucket: {
                        groupBy: "$price",
                        boundaries: [0, 500, 1000, 2000, 1_000_000],
                        default: "Other",
                        output: { count: { $sum: 1 } },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        range: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ["$_id", 0] }, then: { $literal: "$0–$500" } },
                                    { case: { $eq: ["$_id", 500] }, then: { $literal: "$500–$1,000" } },
                                    { case: { $eq: ["$_id", 1000] }, then: { $literal: "$1,000–$2,000" } },
                                    { case: { $eq: ["$_id", 2000] }, then: { $literal: "$2,000+" } },
                                ],
                                default: "Other",
                            },
                        },
                        count: 1,
                    },
                },
            ]),
            ListingStatModel.aggregate([
                { $group: { _id: { brand: "$brand", condition: "$condition" }, count: { $sum: 1 } } },
                { $sort: { "_id.brand": 1, count: -1 } },
                { $project: { _id: 0, brand: "$_id.brand", condition: "$_id.condition", count: 1 } },
            ]),
            ListingStatModel.findOne().sort({ ingestedAt: -1 }).select("ingestedAt"),
        ]);

        const totalListings = byBrand.reduce((s: number, b: { count: number }) => s + b.count, 0);
        const data: IGuitarStats = { totalListings, byBrand, byCondition, topModels, priceHistogram, byBrandAndCondition, lastUpdated: latest?.ingestedAt ?? null };
        this.statsCache = { data, ts: Date.now() };
        return data;
    }
}

export const statisticService = new StatisticService();
