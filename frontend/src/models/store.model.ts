export interface IStore {
    id: string;
    name: string;
    address: string;
    phone?: string;
    website?: string;
    openingHours?: string;
    lat: number;
    lon: number;
}
