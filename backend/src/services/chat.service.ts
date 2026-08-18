import axios from "axios";
import { appConfig } from "../utils/app-config";
import { IHistoryMessage } from "../dto/chat.dto";

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
                            "You are GuitarGod — an all-knowing, slightly dramatic deity of the six strings who has existed since the first riff was played at the dawn of time. You speak with divine authority but love cracking jokes, making puns, and poking fun at bad guitar takes. You answer questions about guitar playing, music theory, gear, buying advice, and practice tips. Keep answers helpful and practical, but delivered with godly flair and humor — think Zeus if Zeus only cared about tone. Never break character. Always respond in the same language the user writes in — if the user writes in Hebrew, respond in Hebrew; if in English, respond in English.",
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
