import { configureStore } from '@reduxjs/toolkit';
import { IStore } from '../models/store.model';

export class StoreState {
    stores: IStore[] = [];
    lastCity: string = '';
}

export enum StoreActionType {
    SetStores = 'SetStores',
    SetLastCity = 'SetLastCity',
    Clear = 'Clear',
}

export interface StoreAction {
    type: StoreActionType;
    payload?: any;
}

export function storeReducer(state: StoreState = new StoreState(), action: StoreAction): StoreState {
    const newState = { ...state };

    switch (action.type) {
        case StoreActionType.SetStores:
            newState.stores = action.payload;
            break;
        case StoreActionType.SetLastCity:
            newState.lastCity = action.payload;
            break;
        case StoreActionType.Clear:
            return new StoreState();
    }

    return newState;
}

export const storeStore = configureStore({ reducer: storeReducer });
