import { JSX, useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { chatService } from '../../services/chat.service';
import { authService } from '../../services/auth.service';
import { appConfig } from '../../utils/app-config';
import { chatStore, ChatActionType, IMessage } from '../../state/chat.state';
import RobotImage from '../../assets/Chatbot-img.png';
import defaultAvatar from '../../assets/default-avatar.png';
import './ChatbotWidget.css';

function ChatbotWidget(): JSX.Element | null {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<IMessage[]>(chatStore.getState().messages);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const user = authService.getLoggedInUser();
    const location = useLocation();

    useEffect(() => {
        const unsubscribe = chatStore.subscribe(() => {
            setMessages(chatStore.getState().messages);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [isOpen]);

    useEffect(() => {
        document.body.classList.toggle('widget-open', isOpen);
        return () => document.body.classList.remove('widget-open');
    }, [isOpen]);


    if (!user || location.pathname === '/chatbot') return null;

    const userAvatar = user.profileImage
        ? (user.profileImage.startsWith('http') ? user.profileImage : `${appConfig.apiAddress}/uploads/${user.profileImage}`)
        : defaultAvatar;

    async function sendMessage(): Promise<void> {
        if (!inputText.trim() || isLoading) return;

        const userMessage: IMessage = { id: crypto.randomUUID(), text: inputText, sender: 'user' };
        chatStore.dispatch({ type: ChatActionType.AddMessage, payload: userMessage });
        setInputText('');
        setIsLoading(true);

        try {
            const reply = await chatService.sendMessage(inputText);
            chatStore.dispatch({ type: ChatActionType.AddMessage, payload: { id: crypto.randomUUID(), text: reply, sender: 'bot' } });
        } catch {
            chatStore.dispatch({ type: ChatActionType.AddMessage, payload: { id: crypto.randomUUID(), text: 'Sorry, something went wrong.', sender: 'bot' } });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
        <div className="chatbot-widget">
            {isOpen && (
                <div className="widget-panel">
                    <div className="widget-header">
                        <span>GuitarBot</span>
                    </div>
                    <div className="widget-messages">
                        {messages.map(msg => (
                            <div key={msg.id} className={`widget-msg widget-msg--${msg.sender}`}>
                                {msg.sender === 'bot' && (
                                    <img src={RobotImage} className="widget-avatar" alt="GuitarBot" />
                                )}
                                <div className="widget-msg-text" dir="auto">{msg.text}</div>
                                {msg.sender === 'user' && (
                                    <img src={userAvatar} className="widget-avatar" alt={user.firstName} />
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="widget-msg widget-msg--bot">
                                <div className="widget-msg-text">...</div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="widget-input">
                        <input
                            placeholder="Ask about guitars..."
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && sendMessage()}
                            dir="auto"
                        />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </div>
            )}
            <button className="widget-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? '✕' : 'Chat'}
            </button>
        </div>
        </>
    );
}

export default ChatbotWidget;
