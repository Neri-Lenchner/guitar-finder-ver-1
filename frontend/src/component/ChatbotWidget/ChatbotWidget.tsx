import { JSX, useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { appConfig } from '../../utils/app-config';
import { chatStore } from '../../state/chat.state';
import { IMessage } from '../../models/message.model';
import { useSendMessage } from '../../hooks/useSendMessage';
import guitarGodImage from '../../assets/guitar-god-face.png';
import defaultAvatar from '../../assets/default-avatar.png';
import './ChatbotWidget.css';
import {IUser} from "../../models/user.model.ts";
import {Unsubscribe} from "@reduxjs/toolkit";

function ChatbotWidget(): JSX.Element | null {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<IMessage[]>(chatStore.getState().messages);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { inputText, setInputText, isLoading, sendMessage } = useSendMessage();
    const user: IUser | null = authService.getLoggedInUser();
    const location = useLocation();

    useEffect((): Unsubscribe => {
        return chatStore.subscribe((): void => setMessages(chatStore.getState().messages));
    }, []);

    useEffect((): void => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        document.body.classList.toggle('widget-open', isOpen);
        if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        return (): void => document.body.classList.remove('widget-open');
    }, [isOpen]);


    if (!user || location.pathname === '/chatbot') return null;

    const userAvatar: string = user.profileImage
        ? (user.profileImage.startsWith('http')
            ? user.profileImage
            : `${appConfig.apiAddress}/uploads/${user.profileImage}`)
        : defaultAvatar;

    return (
        <>
        <div className="chatbot-widget">
            {isOpen && (
                <div className="widget-panel">
                    <div className="widget-header">
                        <span>
                            GuitarGod
                        </span>
                    </div>
                    <div className="widget-messages">
                        {messages.map(msg => (
                            <div
                                key={msg.id}
                                className={`widget-msg widget-msg--${msg.sender}`}>
                                {msg.sender === 'bot' && (
                                    <img
                                        src={guitarGodImage}
                                        className="widget-avatar"
                                        alt="GuitarGod"
                                    />
                                )}
                                <div
                                    className="widget-msg-text"
                                    dir="auto">
                                    {msg.text}
                                </div>
                                {msg.sender === 'user' && (
                                    <img
                                        src={userAvatar}
                                        className="widget-avatar"
                                        alt={user.firstName}
                                    />
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="widget-msg widget-msg--bot">
                                <div className="widget-msg-text">
                                    ...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="widget-input">
                        <input
                            placeholder="Ask about guitars..."
                            value={inputText}
                            onChange={event => setInputText(event.target.value)}
                            onKeyDown={event => { if (event.key === 'Enter') void sendMessage(); }}
                            dir="auto"
                        />
                        <button onClick={(): undefined => void sendMessage()}>
                            Send
                        </button>
                    </div>
                </div>
            )}
            <button
                className="widget-toggle-btn"
                onClick={(): void => setIsOpen(!isOpen)}>
                {isOpen
                    ? '✕'
                    : 'Chat'
                }
            </button>
        </div>
        </>
    );
}

export default ChatbotWidget;
