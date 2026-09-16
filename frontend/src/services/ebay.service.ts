import axios from "axios";
import { appConfig } from "../utils/app-config";
import { IListing } from "../models/guitar.model";

interface IEbayRawListing {
    itemId: string;
    title: string;
    price?: { value: string; currency: string };
    condition?: string;
    image?: { imageUrl: string };
    itemWebUrl: string;
}

const TTL = 5 * 60 * 1000;

function toListing(raw: IEbayRawListing): IListing {
    return {
        id: raw.itemId,
        source: "ebay",
        title: raw.title,
        price: { amount: raw.price?.value ?? "", currency: raw.price?.currency ?? "" },
        condition: raw.condition ?? "",
        imageUrl: raw.image?.imageUrl ?? "",
        url: raw.itemWebUrl ?? "",
    };
}

class EbayService {
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
        const res = await axios.get(`${appConfig.apiAddress}/api/ebay`, {
            params: { query: `${brand} ${model}`, per_page: 50 },
        });
        const raw: IEbayRawListing[] = Array.isArray(res.data) ? res.data : [];
        const data = raw.map(toListing);
        this.set(key, data);
        return data;
    }

    public async fetchBrandListings(brand: string): Promise<IListing[]> {
        const key = `brand||${brand}`;
        const cached = this.get(key);
        if (cached) return cached;
        const res = await axios.get(`${appConfig.apiAddress}/api/ebay`, {
            params: { query: brand, per_page: 50 },
        });
        const raw: IEbayRawListing[] = Array.isArray(res.data) ? res.data : [];
        const data = raw.map(toListing);
        this.set(key, data);
        return data;
    }
}

export const ebayService = new EbayService();
