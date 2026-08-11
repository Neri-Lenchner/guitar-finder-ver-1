import axios from "axios";
import https from "https";

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

function overpassPost(query: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const body = `data=${encodeURIComponent(query)}`;
        const options = {
            hostname: "overpass-api.de",
            path: "/api/interpreter",
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Content-Length": Buffer.byteLength(body),
                "User-Agent": "GuitarFinder/1.0",
            },
        };

        const req = https.request(options, (res) => {
            let data = "";
            res.on("data", (chunk) => data += chunk);
            res.on("end", () => {
                if (res.statusCode && res.statusCode >= 400) {
                    reject(new Error(`Overpass returned ${res.statusCode}: ${data}`));
                } else {
                    try { resolve(JSON.parse(data)); }
                    catch { reject(new Error("Invalid JSON from Overpass")); }
                }
            });
        });

        req.on("error", reject);
        req.write(body);
        req.end();
    });
}

class StoreService {
    public async searchByCity(city: string): Promise<IStore[]> {
        // 1. Geocode city to lat/lon via Nominatim
        const geoRes = await axios.get("https://nominatim.openstreetmap.org/search", {
            params: { q: city, format: "json", limit: 1 },
            headers: { "User-Agent": "GuitarFinder/1.0" },
        });

        if (!geoRes.data.length) {
            console.log("[StoreService] Nominatim found no results for:", city);
            return [];
        }
        const { lat, lon } = geoRes.data[0];
        console.log(`[StoreService] Geocoded "${city}" → lat:${lat} lon:${lon}`);

        // 2. Query Overpass via native https (avoids axios encoding issues)
        const query = `[out:json][timeout:25];(node["shop"="music"](around:15000,${lat},${lon});node["shop"="musical_instrument"](around:15000,${lat},${lon});way["shop"="music"](around:15000,${lat},${lon});way["shop"="musical_instrument"](around:15000,${lat},${lon}););out center;`;

        const json = await overpassPost(query);
        console.log(`[StoreService] Overpass returned ${json.elements?.length ?? 0} elements`);

        return (json.elements ?? [])
            .map((el: any): IStore | null => {
                const elLat = el.lat ?? el.center?.lat;
                const elLon = el.lon ?? el.center?.lon;
                if (!elLat || !elLon) return null;
                return {
                    id: String(el.id),
                    name: el.tags?.name || "Music Store",
                    address: this.buildAddress(el.tags),
                    phone: el.tags?.phone,
                    website: el.tags?.website,
                    openingHours: el.tags?.opening_hours,
                    lat: elLat,
                    lon: elLon,
                };
            })
            .filter(Boolean) as IStore[];
    }

    private buildAddress(tags: any): string {
        if (!tags) return "Address unavailable";
        const parts = [
            tags["addr:street"] && tags["addr:housenumber"]
                ? `${tags["addr:street"]} ${tags["addr:housenumber"]}`
                : tags["addr:street"],
            tags["addr:city"],
            tags["addr:postcode"],
        ].filter(Boolean);
        return parts.length ? parts.join(", ") : "Address unavailable";
    }
}

export const storeService = new StoreService();
