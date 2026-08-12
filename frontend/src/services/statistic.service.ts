import axios from "axios";
import { appConfig } from "../utils/app-config";

export interface IBrandStat {
    brand: string;
    count: number;
    avgPrice: number;
    minPrice: number;
    maxPrice: number;
}

export interface IConditionStat {
    condition: string;
    count: number;
}

export interface IModelStat {
    brand: string;
    model: string;
    count: number;
    avgPrice: number;
}

export interface IPriceHistogramBucket {
    range: string;
    count: number;
}

export interface IBrandConditionStat {
    brand: string;
    condition: string;
    count: number;
}

export interface IGuitarStats {
    totalListings: number;
    byBrand: IBrandStat[];
    byCondition: IConditionStat[];
    topModels: IModelStat[];
    priceHistogram: IPriceHistogramBucket[];
    byBrandAndCondition: IBrandConditionStat[];
    lastUpdated: string | null;
}

class StatisticService {
    public async getStats(): Promise<IGuitarStats> {
        const res = await axios.get(`${appConfig.apiAddress}/api/stats`);
        return res.data;
    }

    public async ingest(brands: { brand: string; models: string[] }[]): Promise<void> {
        await axios.post(`${appConfig.apiAddress}/api/stats/ingest`, { brands });
    }
}

export const statisticService = new StatisticService();
