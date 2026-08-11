import axios from 'axios';
import { appConfig } from '../utils/app-config';
import { storeStore, StoreActionType } from '../state/store.state';

const TTL = 5 * 60 * 1000;

class StoreService {
    private cache = new Map<string, { data: any[]; ts: Date }>();

    public async searchByCity(city: string): Promise<void> {
        storeStore.dispatch({ type: StoreActionType.SetLastCity, payload: city });
        const key = city.trim().toLowerCase();
        const entry = this.cache.get(key);
        if (entry && new Date().getTime() - entry.ts.getTime() < TTL) {
            storeStore.dispatch({ type: StoreActionType.SetStores, payload: entry.data });
            return;
        }
        const response = await axios.get(`${appConfig.apiAddress}/api/stores?city=${encodeURIComponent(city)}`);
        this.cache.set(key, { data: response.data, ts: new Date() });
        storeStore.dispatch({ type: StoreActionType.SetStores, payload: response.data });
    }
}

export const storeService = new StoreService();
