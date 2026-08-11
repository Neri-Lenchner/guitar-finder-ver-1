import axios from "axios";
import { appConfig } from "../utils/app-config";

class ReverbService {
    private readonly baseUrl = "https://api.reverb.com/api";

    public async searchListings(query: string): Promise<any[]> {
        if (!appConfig.reverbToken) {
            throw new Error("Reverb API token not configured");
        }

        const res = await axios.get(`${this.baseUrl}/listings`, {
            params: { query, per_page: 12 },
            headers: {
                "Authorization": `Bearer ${appConfig.reverbToken}`,
                "Accept": "application/hal+json",
                "Content-Type": "application/hal+json",
                "Accept-Version": "3.0",
            },
        });

        console.log("[reverb] status:", res.status);
        console.log("[reverb] listings count:", res.data?.listings?.length ?? 0);
        console.log("[reverb] raw keys:", Object.keys(res.data ?? {}));
        return res.data.listings ?? [];
    }
}

export const reverbService = new ReverbService();
