import { JSX, useState, useRef, useEffect } from 'react';
import { chatService } from '../../services/chat.service';
import { authService } from '../../services/auth.service';
import RobotImage from '../../assets/Chatbot-img.png';
import './ChatbotWidget.css';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
}

function ChatbotWidget(): JSX.Element | null {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 'welcome', text: 'Hi! Ask me anything about guitars!', sender: 'bot' },
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const user = authService.getLoggedInUser();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!user) return null;

    async function sendMessage(): Promise<void> {
        if (!inputText.trim() || isLoading) return;

        const userMessage: Message = { id: crypto.randomUUID(), text: inputText, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {
            const reply = await chatService.sendMessage(inputText);
            setMessages(prev => [...prev, { id: crypto.randomUUID(), text: reply, sender: 'bot' }]);
        } catch {
            setMessages(prev => [...prev, { id: crypto.randomUUID(), text: 'Sorry, something went wrong.', sender: 'bot' }]);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="chatbot-widget">
            {isOpen && (
                <div className="widget-panel">
                    <div className="widget-header">
                        <span>GuitarBot</span>
                        <button onClick={() => setIsOpen(false)} className="widget-close-btn">✕</button>
                    </div>
                    <div className="widget-messages">
                        {messages.map(msg => (
                            <div key={msg.id} className={`widget-msg widget-msg--${msg.sender}`}>
                                {msg.sender === 'bot' && (
                                    <img src={RobotImage} className="widget-avatar" alt="GuitarBot" />
                                )}
                                <div className="widget-msg-text">{msg.text}</div>
                                {msg.sender === 'user' && (
                                    <span className="widget-user-email">{user!.email}</span>
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
                            disabled={isLoading}
                        />
                        <button onClick={sendMessage} disabled={isLoading}>Send</button>
                    </div>
                </div>
            )}
            <button className="widget-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? '✕' : 'Chat'}
            </button>
        </div>
    );
}

export default ChatbotWidget;
