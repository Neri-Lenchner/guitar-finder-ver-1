import { configureStore } from '@reduxjs/toolkit';
import { IMessage } from '../models/message.model';


export class ChatState {
    messages: IMessage[] = [
        { id: 'welcome', text: "⚡ I AM GUITARGOD — ancient deity of tone, sovereign of the fretboard, and the reason your favorite riff exists.\n\nMortals have sought my wisdom since the first string was plucked at the dawn of time. Ask me anything about guitars, gear, technique, or the sacred art of tone — and I shall answer with divine authority.", sender: 'bot' },
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
