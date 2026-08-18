import { configureStore } from '@reduxjs/toolkit';
import { IMessage } from '../models/message.model';


export class ChatState {
    messages: IMessage[] = [
        { id: 'welcome', text: "Hi! I'm GuitarGod. Ask me anything about guitars, gear, or playing technique!\n\nשלום! אני גיטר גוד. שאל אותי כל שאלה על גיטרות, ציוד או טכניקת נגינה!", sender: 'bot' },
    ];

    constructor() {
        try {
            const saved: string | null = localStorage.getItem('chatState');
            if (saved) this.messages = JSON.parse(saved).messages;
        } catch {}
    }
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
            try { localStorage.setItem('chatState', JSON.stringify(newState)); } catch {}
            break;
        case ChatActionType.ClearMessages:
            localStorage.removeItem('chatState');
            return new ChatState();
    }

    return newState;
}

export const chatStore = configureStore({ reducer: chatReducer });
