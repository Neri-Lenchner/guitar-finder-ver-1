import { reverbService } from "./reverb.service";
import { ListingStatModel } from "../models/listing-stat.model";
import { IIngestBrand, IGuitarStats } from "../dto/statistic.dto";

class StatisticService {
    public async ingest(brands: IIngestBrand[]): Promise<number> {
        const results = await Promise.all(
            brands.map(({ brand, models }) =>
                reverbService.searchListings(brand, 50).then(listings => ({ brand, models, listings }))
            )
        );

        let count = 0;
        for (const { brand, models, listings } of results) {
            for (const listing of listings) {
                const price = parseFloat(listing.price?.amount ?? "0");
                if (!price) continue;
                const title: string = listing.title ?? "";
                const guitarModel = models.find(m => title.toLowerCase().includes(m.toLowerCase())) ?? "";
                await ListingStatModel.updateOne(
                    { listingId: String(listing.id) },
                    {
                        $setOnInsert: {
                            listingId: String(listing.id),
                            brand,
                            guitarModel,
                            title,
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
        return count;
    }

    public async getStats(): Promise<IGuitarStats> {
        const [totalListings, byBrand, byCondition, topModels, priceHistogram, byBrandAndCondition, latest] = await Promise.all([
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

        return { totalListings, byBrand, byCondition, topModels, priceHistogram, byBrandAndCondition, lastUpdated: latest?.ingestedAt ?? null };
    }
}

export const statisticService = new StatisticService();
