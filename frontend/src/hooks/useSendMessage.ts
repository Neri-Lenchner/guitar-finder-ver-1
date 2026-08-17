import { useState } from 'react';
import { chatService } from '../services/chat.service';
import { chatStore, ChatActionType } from '../state/chat.state';
import { IMessage } from '../models/message.model';

export function useSendMessage(onAfterClear?: () => void) {
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function sendMessage(text?: string): Promise<void> {
        const messageText = text ?? inputText;
        if (!messageText.trim() || isLoading) return;

        const history: IMessage[] = chatStore.getState().messages;
        const userMessage: IMessage = { id: crypto.randomUUID(), text: messageText, sender: 'user', timestamp: new Date().toISOString() };
        chatStore.dispatch({ type: ChatActionType.AddMessage, payload: userMessage });
        if (!text) setInputText('');
        onAfterClear?.();
        setIsLoading(true);

        try {
            const reply: string = await chatService.sendMessage(messageText, history);
            chatStore.dispatch({ type: ChatActionType.AddMessage, payload: { id: crypto.randomUUID(), text: reply, sender: 'bot', timestamp: new Date().toISOString() } });
        } catch {
            chatStore.dispatch({ type: ChatActionType.AddMessage, payload: { id: crypto.randomUUID(), text: 'Sorry, something went wrong.', sender: 'bot', timestamp: new Date().toISOString() } });
        } finally {
            setIsLoading(false);
        }
    }

    return { inputText, setInputText, isLoading, sendMessage };
}
