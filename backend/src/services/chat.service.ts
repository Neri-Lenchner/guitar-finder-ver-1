import axios from "axios";
import { appConfig } from "../utils/app-config";

interface IHistoryMessage {
    text: string;
    sender: 'user' | 'bot';
}

class ChatService {
    public async getResponse(userMessage: string, history: IHistoryMessage[] = []): Promise<string> {
        const historyMessages = history.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant' as const,
            content: msg.text,
        }));

        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content:
                            "You are a helpful guitar expert assistant. Answer questions about guitar playing, music theory, gear, buying advice, and practice tips. Keep answers concise and practical. Always respond in the same language the user writes in — if the user writes in Hebrew, respond in Hebrew; if in English, respond in English.",
                    },
                    ...historyMessages,
                    { role: "user", content: userMessage },
                ],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${appConfig.openAiApiKey}`,
                },
            }
        );
        return response.data.choices[0].message.content as string;
    }
}

export const chatService = new ChatService();
