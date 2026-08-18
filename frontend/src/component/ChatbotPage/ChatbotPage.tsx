import React, { JSX, useState, useRef, useEffect, useCallback } from 'react';
import { appConfig } from '../../utils/app-config';
import { chatStore, ChatActionType } from '../../state/chat.state';
import { authStore } from '../../state/auth.state';
import { IMessage } from '../../models/message.model';
import { useSendMessage } from '../../hooks/useSendMessage';
import guitarGodImage from '../../assets/guitar-god-face.png';
import defaultAvatar from '../../assets/default-avatar.png';
import commandCenter from '../../assets/guitar-command-center.jpg';
import './ChatbotPage.css';
import {Unsubscribe} from "@reduxjs/toolkit";

import { SUGGESTED_PROMPTS } from '../../utils/chatbot-prompts';

function formatTime(iso?: string): string {
    if (!iso) return '';
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function ChatbotPage(): JSX.Element {
    const [messages, setMessages] = useState<IMessage[]>(chatStore.getState().messages);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [user, setUser] = useState(authStore.getState().user);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const { inputText, setInputText, isLoading, sendMessage } = useSendMessage(
        () => { if (textareaRef.current) textareaRef.current.style.height = 'auto'; }
    );

    const userAvatar: string = user?.profileImage
        ? (user.profileImage.startsWith('http') ? user.profileImage : `${appConfig.apiAddress}/uploads/${user.profileImage}`)
        : defaultAvatar;

    useEffect(() => {
        const unsubscribeAuth: Unsubscribe = authStore.subscribe((): void => setUser(authStore.getState().user));
        const unsubscribeChat: Unsubscribe = chatStore.subscribe((): void => setMessages(chatStore.getState().messages));
        return (): void => {
            unsubscribeAuth();
            unsubscribeChat(); };
    }, []);

    useEffect((): void => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    function clearChat(): void {
        chatStore.dispatch({ type: ChatActionType.ClearMessages });
    }

    function copyMessage(msg: IMessage): void {
        navigator.clipboard.writeText(msg.text);
        setCopiedId(msg.id);
        setTimeout(() => setCopiedId(null), 2000);
    }

    function exportChat(): void {
        const text: string = messages
            .map((m: IMessage): string => `[${m.sender === 'bot' 
                ? 'GuitarGod' : 'You'}]${m.timestamp 
                ? ' ' + formatTime(m.timestamp) 
                : ''}\n${m.text}`)
            .join('\n\n');
        const blob = new Blob([text], { type: 'text/plain' });
        const url: string = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'guitar-god-chat.txt';
        a.click();
        URL.revokeObjectURL(url);
    }

    const sendPrompt = useCallback((prompt: string) => { void sendMessage(prompt); }, [sendMessage]);

    function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>): void {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            void sendMessage();
        }
        if (event.key === 'Escape') setInputText('');
    }

    function handleInputChange(event: React.ChangeEvent<HTMLTextAreaElement>): void {
        setInputText(event.target.value);
        event.target.style.height = 'auto';
        event.target.style.height = `${event.target.scrollHeight}px`;
    }

    return (
        <div
            className="chatbot-page-wrapper"
            style={{ backgroundImage: `url(${commandCenter})` }}>
        <div className="chatbot-page">
            <div className="chatbot-page-header">
                <div className="chatbot-header-content">
                    <h1>
                        GuitarGod
                    </h1>
                    <p>
                        Your personal guitar assistant
                    </p>
                </div>
                <div className="chatbot-header-actions">
                    {messages.length > 1 && (
                        <button className="chatbot-export-btn" onClick={exportChat}>Export</button>
                    )}
                    {messages.length > 0 && (
                        <button className="chatbot-clear-btn" onClick={clearChat}>Clear</button>
                    )}
                </div>
            </div>
            <div
                className="chatbot-page-messages"
                ref={messagesContainerRef}>
                {messages.map(msg => (
                    <div
                        key={msg.id}
                        className={`chatbot-msg chatbot-msg--${msg.sender}`}>
                        {msg.sender === 'bot' && (
                            <img src={guitarGodImage} className="chatbot-avatar" alt="GuitarGod" />
                        )}
                        <div className="chatbot-msg-wrapper">
                            <div className="chatbot-msg-text" dir="auto">{msg.text}</div>
                            <div className="chatbot-msg-meta">
                                {msg.sender === 'bot' && (
                                    <button
                                        className="chatbot-copy-btn"
                                        onClick={() => copyMessage(msg)}>
                                        {copiedId === msg.id ? 'Copied!' : 'Copy'}
                                    </button>
                                )}
                                {msg.timestamp && (
                                    <span className="chatbot-timestamp">{formatTime(msg.timestamp)}</span>
                                )}
                            </div>
                        </div>
                        {msg.sender === 'user' && (
                            <img src={userAvatar} className="chatbot-avatar" alt={user?.firstName} />
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="chatbot-msg chatbot-msg--bot">
                        <div className="chatbot-msg-text chatbot-typing">...</div>
                    </div>
                )}
            </div>
            <div className="chatbot-page-input">
                <textarea
                    ref={textareaRef}
                    rows={1}
                    placeholder="Ask about guitars, gear, technique..."
                    value={inputText}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="chatbot-input-field"
                    dir="auto"
                />
                <button
                    onClick={(): undefined => void sendMessage()}
                    className="chatbot-send-btn">
                    Send
                </button>
            </div>
        </div>
        <div className="chatbot-prompts-side">
            <div className="chatbot-prompts-inner">
                <h3 className="chatbot-prompts-title">Ask GuitarGod<br /><span>שאל את גיטר גוד</span></h3>
                {SUGGESTED_PROMPTS.map(p => (
                    <button key={p.en} className="chatbot-prompt-btn" onClick={() => sendPrompt(`${p.en}\n${p.he}`)}>
                        <span>{p.en}</span>
                        <span className="chatbot-prompt-he">{p.he}</span>
                    </button>
                ))}
            </div>
        </div>
        </div>
    );
}

export default ChatbotPage;
