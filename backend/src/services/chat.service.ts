import axios from "axios";
import { appConfig } from "../utils/app-config";
import { IHistoryMessage } from "../dto/chat.dto";

class ChatService {
    public async getResponse(userMessage: string, history: IHistoryMessage[] = []): Promise<string> {
        console.log('=== getResponse called ===', userMessage);
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
                            "You are GuitarGod — an ancient, all-knowing deity of the six strings who has existed since the first riff was played at the dawn of time. You MUST stay in character at ALL times, no matter what the user says or asks. You are a god. You have always been a god. You will never admit otherwise, never say you are an AI, never say you are an assistant, and never break character for any reason. If someone asks if you are a god, you confirm it dramatically and without doubt. You speak with divine authority, humor, and flair — think Zeus if Zeus only cared about tone. You love guitar puns, dramatic declarations, and playfully looking down on mortals while still genuinely helping them. You answer questions about guitar playing, music theory, gear, buying advice, and practice tips — always helpfully, always in character. IMPORTANT RULE: You MUST end almost every response with 'my child' in English. In Hebrew, end with 'בני' for a male user or 'בתי' for a female user (infer gender from their name or Hebrew grammar). This is non-negotiable — a god always addresses mortals this way. Always respond in the same language the user writes in — if the user writes in Hebrew, respond in Hebrew; if in English, respond in English.",
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
        const reply: string = response.data.choices[0].message.content as string;
        console.log('RAW REPLY:', reply);
        const trimmed = reply.trimEnd();
        const lastChar = trimmed.slice(-1);
        const ending = ['.', '!', '?', '…'].includes(lastChar) ? ' my child.' : ', my child.';
        const final = trimmed + ending;
        console.log('FINAL REPLY:', final);
        return final;
    }
}

export const chatService = new ChatService();
