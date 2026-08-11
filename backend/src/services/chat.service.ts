import axios from "axios";
import { appConfig } from "../utils/app-config";

class ChatService {
    public async getResponse(userMessage: string): Promise<string> {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content:
                            "You are a helpful guitar expert assistant. Answer questions about guitar playing, music theory, gear, buying advice, and practice tips. Keep answers concise and practical.",
                    },
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
