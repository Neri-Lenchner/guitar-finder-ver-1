import { useState } from 'react';
import { chatService } from '../services/chat.service';
import { chatStore, ChatActionType } from '../state/chat.state';
import { IMessage } from '../models/message.model';

export function useSendMessage(onAfterClear?: () => void) {
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function sendMessage(): Promise<void> {
        if (!inputText.trim() || isLoading) return;

        const history: IMessage[] = chatStore.getState().messages;
        const userMessage: IMessage = { id: crypto.randomUUID(), text: inputText, sender: 'user' };
        chatStore.dispatch({ type: ChatActionType.AddMessage, payload: userMessage });
        setInputText('');
        onAfterClear?.();
        setIsLoading(true);

        try {
            const reply: string = await chatService.sendMessage(inputText, history);
            chatStore.dispatch({ type: ChatActionType.AddMessage, payload: { id: crypto.randomUUID(), text: reply, sender: 'bot' } });
        } catch {
            chatStore.dispatch({ type: ChatActionType.AddMessage, payload: { id: crypto.randomUUID(), text: 'Sorry, something went wrong.', sender: 'bot' } });
        } finally {
            setIsLoading(false);
        }
    }

    return { inputText, setInputText, isLoading, sendMessage };
}
