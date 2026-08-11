import { IUser } from '../models/user.model';
import { jwtDecode } from 'jwt-decode';
import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';

export class AuthState {
    user: IUser | null = null;
    token: string | null = null;

    constructor() {
        const token = localStorage.getItem('token');
        if (token) {
            this.token = token;
            this.user = jwtDecode<IUser>(token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }
}

export enum AuthActionType {
    Register = 'Register',
    Login = 'Login',
    Logout = 'Logout',
    UpdateProfile = 'UpdateProfile',
}

export interface AuthAction {
    type: AuthActionType;
    payload?: string;
}

export function authReducer(authState: AuthState = new AuthState(), action: AuthAction): AuthState {
    const newState = { ...authState };
    switch (action.type) {
        case AuthActionType.Register:
        case AuthActionType.Login:
        case AuthActionType.UpdateProfile:
            newState.token = action.payload!;
            newState.user = jwtDecode<IUser>(action.payload!);
            localStorage.setItem('token', action.payload!);
            axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload}`;
            break;
        case AuthActionType.Logout:
            localStorage.removeItem('token');
            newState.token = null;
            newState.user = null;
            delete axios.defaults.headers.common['Authorization'];
            break;
    }
    return newState;
}

export const authStore = configureStore({ reducer: authReducer });
