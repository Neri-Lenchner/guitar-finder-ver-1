import axios from "axios";
import { appConfig } from "../utils/app-config";

export interface IFollowedListing {
    _id: string;
    listingId: string;
    title: string;
    price: { amount: string; currency: string };
    condition: string;
    imageUrl: string;
    reverbUrl: string;
    followedAt: string;
}

class FollowedService {
    public async getAll(): Promise<IFollowedListing[]> {
        const res = await axios.get(`${appConfig.apiAddress}/api/followed`);
        return res.data;
    }

    public async follow(listing: Omit<IFollowedListing, "_id" | "followedAt">): Promise<IFollowedListing> {
        const res = await axios.post(`${appConfig.apiAddress}/api/followed`, listing);
        return res.data;
    }

    public async unfollow(listingId: string): Promise<void> {
        await axios.delete(`${appConfig.apiAddress}/api/followed/${listingId}`);
    }
}

export const followedService = new FollowedService();
