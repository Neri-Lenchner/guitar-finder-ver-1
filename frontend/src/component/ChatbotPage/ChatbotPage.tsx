import React, { JSX, useState, useRef, useEffect } from 'react';
import { appConfig } from '../../utils/app-config';
import { chatStore, ChatActionType } from '../../state/chat.state';
import { authStore } from '../../state/auth.state';
import { IMessage } from '../../models/message.model';
import { useSendMessage } from '../../hooks/useSendMessage';
import RobotImage from '../../assets/Chatbot-img.png';
import defaultAvatar from '../../assets/default-avatar.png';
import commandCenter from '../../assets/guitar-command-center.jpg';
import './ChatbotPage.css';
import {Unsubscribe} from "@reduxjs/toolkit";

function ChatbotPage(): JSX.Element {
    const [messages, setMessages] = useState<IMessage[]>(chatStore.getState().messages);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [user, setUser] = useState(authStore.getState().user);
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
                        GuitarBot
                    </h1>
                    <p>
                        Your personal guitar assistant
                    </p>
                </div>
                {messages.length > 0 && (
                    <button
                        className="chatbot-clear-btn"
                        onClick={clearChat}>
                        Clear
                    </button>
                )}
            </div>
            <div
                className="chatbot-page-messages"
                ref={messagesContainerRef}>
                {messages.map(msg => (
                    <div
                        key={msg.id}
                        className={`chatbot-msg chatbot-msg--${msg.sender}`}>
                        {msg.sender === 'bot' && (
                            <img
                                src={RobotImage}
                                className="chatbot-avatar"
                                alt="GuitarBot"
                            />
                        )}
                        <div
                            className="chatbot-msg-text"
                            dir="auto">
                            {msg.text}
                        </div>
                        {msg.sender === 'user' && (
                            <img
                                src={userAvatar}
                                className="chatbot-avatar"
                                alt={user?.firstName}
                            />
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
        </div>
    );
}

export default ChatbotPage;
