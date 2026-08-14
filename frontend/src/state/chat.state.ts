import { configureStore } from '@reduxjs/toolkit';

export interface IMessage {
    id: string;
    text: string;
    sender: 'user' | 'bot';
}

export class ChatState {
    messages: IMessage[] = [
        { id: 'welcome', text: "Hi! I'm GuitarBot. Ask me anything about guitars, gear, or playing technique!\n\nשלום! אני גיטרבוט. שאל אותי כל שאלה על גיטרות, ציוד או טכניקת נגינה!", sender: 'bot' },
    ];
}

export enum ChatActionType {
    AddMessage = 'AddMessage',
    ClearMessages = 'ClearMessages',
}

export interface ChatAction {
    type: ChatActionType;
    payload?: IMessage;
}

export function chatReducer(chatState: ChatState = new ChatState(), action: ChatAction): ChatState {
    const newState = { ...chatState };

    switch (action.type) {
        case ChatActionType.AddMessage:
            newState.messages = [...newState.messages, action.payload!];
            break;
        case ChatActionType.ClearMessages:
            return new ChatState();
    }

    return newState;
}

const _savedChat = (() => {
    try {
        const s = localStorage.getItem('chatState');
        return s ? JSON.parse(s) : undefined;
    } catch { return undefined; }
})();

export const chatStore = configureStore({ reducer: chatReducer, preloadedState: _savedChat });

chatStore.subscribe(() => {
    try { localStorage.setItem('chatState', JSON.stringify(chatStore.getState())); } catch {}
});
