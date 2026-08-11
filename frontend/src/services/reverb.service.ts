import axios from "axios";
import { appConfig } from "../utils/app-config";
import { IReverbListing } from "../models/guitar.model";

const TTL = 5 * 60 * 1000;

class ReverbService {
    private cache = new Map<string, { data: IReverbListing[]; ts: Date }>();

    private get(key: string): IReverbListing[] | null {
        const entry = this.cache.get(key);
        if (entry && new Date().getTime() - entry.ts.getTime() < TTL) return entry.data;
        return null;
    }

    private set(key: string, data: IReverbListing[]): void {
        this.cache.set(key, { data, ts: new Date() });
    }

    public async searchListings(brand: string, model: string): Promise<IReverbListing[]> {
        const key = `${brand}||${model}`;
        const cached = this.get(key);
        if (cached) return cached;
        const res = await axios.get(`${appConfig.apiAddress}/api/reverb`, {
            params: { query: `${brand} ${model}` },
        });
        const data = Array.isArray(res.data) ? res.data : [];
        this.set(key, data);
        return data;
    }

    public async fetchBrandListings(brand: string): Promise<IReverbListing[]> {
        const key = `brand||${brand}`;
        const cached = this.get(key);
        if (cached) return cached;
        const res = await axios.get(`${appConfig.apiAddress}/api/reverb`, {
            params: { query: brand, per_page: 50 },
        });
        const data = Array.isArray(res.data) ? res.data : [];
        this.set(key, data);
        return data;
    }
}

export const reverbService = new ReverbService();
