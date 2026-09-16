import axios from "axios";
import { appConfig } from "../utils/app-config";

class EbayService {
    private readonly authUrl = "https://api.ebay.com/identity/v1/oauth2/token";
    private readonly baseUrl = "https://api.ebay.com/buy/browse/v1";
    private token: string | null = null;
    private tokenExpiresAt = 0;

    private async getToken(): Promise<string> {
        if (this.token && Date.now() < this.tokenExpiresAt) return this.token;

        const credentials = Buffer.from(`${appConfig.ebayClientId}:${appConfig.ebayClientSecret}`).toString("base64");
        const res = await axios.post(
            this.authUrl,
            new URLSearchParams({
                grant_type: "client_credentials",
                scope: "https://api.ebay.com/oauth/api_scope",
            }),
            {
                headers: {
                    "Authorization": `Basic ${credentials}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        this.token = res.data.access_token;
        this.tokenExpiresAt = Date.now() + (res.data.expires_in - 60) * 1000;
        return this.token!;
    }

    public async searchListings(query: string, perPage: number = 12): Promise<any[]> {
        if (!appConfig.ebayClientId || !appConfig.ebayClientSecret) {
            throw new Error("eBay API credentials not configured");
        }

        const token = await this.getToken();
        const res = await axios.get(`${this.baseUrl}/item_summary/search`, {
            params: { q: query, category_ids: "33021", limit: perPage },
            headers: {
                "Authorization": `Bearer ${token}`,
                "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
            },
        });

        return res.data.itemSummaries ?? [];
    }
}

export const ebayService = new EbayService();
