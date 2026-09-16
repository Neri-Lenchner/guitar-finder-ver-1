import axios from "axios";
import { appConfig } from "../utils/app-config";

class EtsyService {
    private readonly baseUrl = "https://api.etsy.com/v3/application";

    public async searchListings(query: string, perPage: number = 12): Promise<any[]> {
        if (!appConfig.etsyApiKey) {
            throw new Error("Etsy API key not configured");
        }

        const res = await axios.get(`${this.baseUrl}/listings/active`, {
            params: { keywords: `${query} guitar`, limit: perPage, includes: "Images" },
            headers: { "x-api-key": appConfig.etsyApiKey },
        });

        return res.data.results ?? [];
    }
}

export const etsyService = new EtsyService();
