// cspell:ignore housenumber
export interface IStore {
    id: string;
    name: string;
    address: string;
    phone?: string;
    email?: string;
    website?: string;
    openingHours?: string;
    lat: number;
    lon: number;
}

export interface IOverpassTags {
    name?: string;
    phone?: string;
    "contact:phone"?: string;
    email?: string;
    "contact:email"?: string;
    website?: string;
    "contact:website"?: string;
    opening_hours?: string;
    "addr:street"?: string;
    "addr:housenumber"?: string;
    "addr:city"?: string;
    "addr:postcode"?: string;
}

export interface IOverpassElement {
    id: number;
    lat?: number;
    lon?: number;
    center?: { lat: number; lon: number };
    tags?: IOverpassTags;
}

export interface IOverpassResponse {
    elements: IOverpassElement[];
}
