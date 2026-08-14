import axios from "axios";
import { IStore, IOverpassTags, IOverpassElement, IOverpassResponse } from "../dto/store.dto";

const OVERPASS_MIRRORS = [
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass.openstreetmap.fr/api/interpreter",
    "https://overpass-api.de/api/interpreter",
];

async function overpassPost(query: string): Promise<IOverpassResponse> {
    let lastError: unknown;
    for (const mirror of OVERPASS_MIRRORS) {
        try {
            const res = await axios.post<IOverpassResponse>(
                mirror,
                `data=${encodeURIComponent(query)}`,
                { headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "GuitarFinder/1.0" }, timeout: 20000 }
            );
            return res.data;
        } catch (err) {
            console.log(`[stores] mirror failed: ${mirror}`);
            lastError = err;
        }
    }
    throw lastError;
}

class StoreService {
    public async searchByCity(city: string): Promise<IStore[]> {
        // 1. Geocode city to lat/lon via Nominatim
        const geoRes = await axios.get("https://nominatim.openstreetmap.org/search", {
            params: { q: city, format: "json", limit: 1 },
            headers: { "User-Agent": "GuitarFinder/1.0" },
        });

        if (!geoRes.data.length) return [];
        const { lat, lon } = geoRes.data[0];
        console.log(`[stores] geocoded "${city}" → lat=${lat}, lon=${lon}`);

        // 2. Query Overpass via native https (avoids axios encoding issues)
        const query = `[out:json][timeout:25];(node["shop"="musical_instrument"](around:15000,${lat},${lon});way["shop"="musical_instrument"](around:15000,${lat},${lon}););out center;`;

        const json = await overpassPost(query);
        console.log(`[stores] Overpass returned ${json.elements?.length ?? 0} elements`);
        return (json.elements ?? [])
            .map((el: IOverpassElement): IStore | null => {
                const elLat: number | undefined = el.lat ?? el.center?.lat;
                const elLon: number | undefined = el.lon ?? el.center?.lon;
                if (!elLat || !elLon) return null;
                return {
                    id: String(el.id),
                    name: el.tags?.name || "Music Store",
                    address: this.buildAddress(el.tags),
                    phone: el.tags?.phone || el.tags?.["contact:phone"],
                    email: el.tags?.email || el.tags?.["contact:email"],
                    website: el.tags?.website || el.tags?.["contact:website"],
                    openingHours: el.tags?.opening_hours,
                    lat: elLat,
                    lon: elLon,
                };
            })
            .filter(Boolean) as IStore[];
    }

    private buildAddress(tags: IOverpassTags | undefined): string {
        if (!tags) return "Address unavailable";
        const parts: string[] = [
            tags["addr:street"] && tags["addr:housenumber"]
                ? `${tags["addr:street"]} ${tags["addr:housenumber"]}`
                : tags["addr:street"],
            tags["addr:city"],
            tags["addr:postcode"],
        ].filter((p): p is string => Boolean(p));
        return parts.length ? parts.join(", ") : "Address unavailable";
    }
}

export const storeService = new StoreService();
