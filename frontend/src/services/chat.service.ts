import axios from 'axios';
import { appConfig } from '../utils/app-config';
import { IMessage } from '../state/chat.state';

class ChatService {
    public async sendMessage(message: string, history: IMessage[]): Promise<string> {
        const response = await axios.post(`${appConfig.apiAddress}/api/chat`, { message, history });
        return response.data.reply as string;
    }
}

export const chatService = new ChatService();
