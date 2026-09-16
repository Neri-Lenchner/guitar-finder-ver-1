import axios from "axios";
import { appConfig } from "../utils/app-config";
import { IListing } from "../models/guitar.model";

interface IEtsyRawListing {
    listing_id: number;
    title: string;
    price?: { amount: number; divisor: number; currency_code: string };
    url: string;
    images?: Array<{ url_570xN: string }>;
}

const TTL = 5 * 60 * 1000;

function toListing(raw: IEtsyRawListing): IListing {
    const amount = raw.price ? raw.price.amount / raw.price.divisor : 0;
    return {
        id: String(raw.listing_id),
        source: "etsy",
        title: raw.title,
        price: { amount: amount ? amount.toFixed(2) : "", currency: raw.price?.currency_code ?? "" },
        condition: "",
        imageUrl: raw.images?.[0]?.url_570xN ?? "",
        url: raw.url ?? "",
    };
}

class EtsyService {
    private cache = new Map<string, { data: IListing[]; ts: Date }>();

    private get(key: string): IListing[] | null {
        const entry = this.cache.get(key);
        if (entry && new Date().getTime() - entry.ts.getTime() < TTL) return entry.data;
        return null;
    }

    private set(key: string, data: IListing[]): void {
        this.cache.set(key, { data, ts: new Date() });
    }

    public async searchListings(brand: string, model: string): Promise<IListing[]> {
        const key = `${brand}||${model}`;
        const cached = this.get(key);
        if (cached) return cached;
        const res = await axios.get(`${appConfig.apiAddress}/api/etsy`, {
            params: { query: `${brand} ${model}`, per_page: 50 },
        });
        const raw: IEtsyRawListing[] = Array.isArray(res.data) ? res.data : [];
        const data = raw.map(toListing);
        this.set(key, data);
        return data;
    }

    public async fetchBrandListings(brand: string): Promise<IListing[]> {
        const key = `brand||${brand}`;
        const cached = this.get(key);
        if (cached) return cached;
        const res = await axios.get(`${appConfig.apiAddress}/api/etsy`, {
            params: { query: brand, per_page: 50 },
        });
        const raw: IEtsyRawListing[] = Array.isArray(res.data) ? res.data : [];
        const data = raw.map(toListing);
        this.set(key, data);
        return data;
    }
}

export const etsyService = new EtsyService();
