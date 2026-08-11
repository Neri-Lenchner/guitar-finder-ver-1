import axios from 'axios';
import { appConfig } from '../utils/app-config';
import { storeStore, StoreActionType } from '../state/store.state';

class StoreService {
    public async searchByCity(city: string): Promise<void> {
        storeStore.dispatch({ type: StoreActionType.SetLastCity, payload: city });
        const response = await axios.get(`${appConfig.apiAddress}/api/stores?city=${encodeURIComponent(city)}`);
        storeStore.dispatch({ type: StoreActionType.SetStores, payload: response.data });
    }
}

export const storeService = new StoreService();
