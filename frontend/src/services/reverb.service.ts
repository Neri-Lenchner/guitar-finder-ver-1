import axios from "axios";
import { appConfig } from "../utils/app-config";
import { IReverbListing } from "../models/guitar.model";

class ReverbService {
    public async searchListings(brand: string, model: string): Promise<IReverbListing[]> {
        const query = `${brand} ${model}`;
        const res = await axios.get(`${appConfig.apiAddress}/api/reverb`, {
            params: { query },
        });
        return Array.isArray(res.data) ? res.data : [];
    }
}

export const reverbService = new ReverbService();
