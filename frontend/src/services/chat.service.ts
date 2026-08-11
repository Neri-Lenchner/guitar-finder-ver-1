import axios from 'axios';
import { appConfig } from '../utils/app-config';

class ChatService {
    public async sendMessage(message: string): Promise<string> {
        const response = await axios.post(`${appConfig.apiAddress}/api/chat`, { message });
        return response.data.reply as string;
    }
}

export const chatService = new ChatService();
