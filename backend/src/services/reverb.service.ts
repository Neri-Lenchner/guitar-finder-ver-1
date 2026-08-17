import axios from "axios";
import { appConfig } from "../utils/app-config";

class ReverbService {
    private readonly baseUrl = "https://api.reverb.com/api";

    public async searchListings(query: string, perPage: number = 12): Promise<any[]> {
        if (!appConfig.reverbToken) {
            throw new Error("Reverb API token not configured");
        }

        const res = await axios.get(`${this.baseUrl}/listings`, {
            params: { query, per_page: perPage },
            headers: {
                "Authorization": `Bearer ${appConfig.reverbToken}`,
                "Accept": "application/hal+json",
                "Content-Type": "application/hal+json",
                "Accept-Version": "3.0",
            },
        });

        return res.data.listings ?? [];
    }
}

export const reverbService = new ReverbService();
