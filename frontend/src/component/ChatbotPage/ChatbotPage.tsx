import { JSX, useState, useRef, useEffect } from 'react';
import { chatService } from '../../services/chat.service';
import { authService } from '../../services/auth.service';
import RobotImage from '../../assets/Chatbot-img.png';
import './ChatbotPage.css';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
}

function ChatbotPage(): JSX.Element {
    const [messages, setMessages] = useState<Message[]>([
        { id: 'welcome', text: "Hi! I'm GuitarBot. Ask me anything about guitars, gear, or playing technique!", sender: 'bot' },
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const userEmail = authService.getLoggedInUser()?.email ?? '';

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

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
            setMessages(prev => [...prev, { id: crypto.randomUUID(), text: 'Sorry, something went wrong. Please try again.', sender: 'bot' }]);
        } finally {
            setIsLoading(false);
        }
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
        if (event.key === 'Enter') sendMessage();
        if (event.key === 'Escape') setInputText('');
    }

    return (
        <div className="chatbot-page">
            <div className="chatbot-page-header">
                <h1>GuitarBot</h1>
                <p>Your personal guitar assistant</p>
            </div>
            <div className="chatbot-page-messages">
                {messages.map(msg => (
                    <div key={msg.id} className={`chatbot-msg chatbot-msg--${msg.sender}`}>
                        {msg.sender === 'bot' && (
                            <img src={RobotImage} className="chatbot-avatar" alt="GuitarBot" />
                        )}
                        <div className="chatbot-msg-text">{msg.text}</div>
                        {msg.sender === 'user' && (
                            <span className="chatbot-user-email">{userEmail}</span>
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="chatbot-msg chatbot-msg--bot">
                        <div className="chatbot-msg-text chatbot-typing">...</div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="chatbot-page-input">
                <input
                    type="text"
                    placeholder="Ask about guitars, gear, technique..."
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    className="chatbot-input-field"
                />
                <button onClick={sendMessage} disabled={isLoading} className="chatbot-send-btn">
                    Send
                </button>
            </div>
        </div>
    );
}

export default ChatbotPage;
