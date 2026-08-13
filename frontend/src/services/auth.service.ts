import axios from 'axios';
import { appConfig } from '../utils/app-config';
import { ICredentials, IUser, IUserRegister } from '../models/user.model';
import { authStore, AuthActionType } from '../state/auth.state';
import { chatStore, ChatActionType } from '../state/chat.state';
import { storeStore, StoreActionType } from '../state/store.state';

class AuthService {
    public async register(userData: IUserRegister): Promise<void> {
        const formData = new FormData();
        formData.append('firstName', userData.firstName);
        formData.append('lastName', userData.lastName);
        formData.append('email', userData.email);
        formData.append('password', userData.password);
        if (userData.profileImage?.[0]) formData.append('profileImage', userData.profileImage[0]);
        const response = await axios.post(`${appConfig.apiAddress}/api/auth/register`, formData);
        authStore.dispatch({ type: AuthActionType.Register, payload: response.data });
    }

    public async login(credentials: ICredentials): Promise<void> {
        const response = await axios.post(`${appConfig.apiAddress}/api/auth/login`, credentials);
        authStore.dispatch({ type: AuthActionType.Login, payload: response.data });
    }

    public async updateProfile(userId: string, data: { firstName?: string; lastName?: string; profileImage?: File }): Promise<void> {
        const formData = new FormData();
        if (data.firstName) formData.append('firstName', data.firstName);
        if (data.lastName) formData.append('lastName', data.lastName);
        if (data.profileImage) formData.append('profileImage', data.profileImage);
        const response = await axios.put(`${appConfig.apiAddress}/api/users/${userId}`, formData);
        authStore.dispatch({ type: AuthActionType.UpdateProfile, payload: response.data });
    }

    public logout(): void {
        authStore.dispatch({ type: AuthActionType.Logout });
        chatStore.dispatch({ type: ChatActionType.ClearMessages });
        storeStore.dispatch({ type: StoreActionType.Clear });
        localStorage.removeItem('chatState');
    }

    public getLoggedInUser(): IUser | null {
        return authStore.getState().user;
    }
}

export const authService = new AuthService();
