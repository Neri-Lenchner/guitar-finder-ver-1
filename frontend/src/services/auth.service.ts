import axios from 'axios';
import { appConfig } from '../utils/app-config';
import { ICredentials, IUser, IUserRegister } from '../models/user.model';
import { authStore, AuthActionType } from '../state/auth.state';

class AuthService {
    public async register(userData: IUserRegister): Promise<void> {
        const response = await axios.post(`${appConfig.apiAddress}/api/auth/register`, userData);
        authStore.dispatch({ type: AuthActionType.Register, payload: response.data });
    }

    public async login(credentials: ICredentials): Promise<void> {
        const response = await axios.post(`${appConfig.apiAddress}/api/auth/login`, credentials);
        authStore.dispatch({ type: AuthActionType.Login, payload: response.data });
    }

    public logout(): void {
        authStore.dispatch({ type: AuthActionType.Logout });
    }

    public getLoggedInUser(): IUser | null {
        return authStore.getState().user;
    }
}

export const authService = new AuthService();
