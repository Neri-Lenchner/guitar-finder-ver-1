export interface IIngestBrand {
    brand: string;
    models: string[];
}

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

export interface IGuitarStats {
    totalListings: number;
    byBrand: IBrandStat[];
    byCondition: IConditionStat[];
    topModels: IModelStat[];
    lastUpdated: Date | null;
}
