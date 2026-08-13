import { JSX, useState, useRef, useEffect } from 'react';
import { chatService } from '../../services/chat.service';
import { authService } from '../../services/auth.service';
import { appConfig } from '../../utils/app-config';
import { chatStore, ChatActionType, IMessage } from '../../state/chat.state';
import RobotImage from '../../assets/Chatbot-img.png';
import defaultAvatar from '../../assets/default-avatar.png';
import commandCenter from '../../assets/guitar-command-center.jpg';
import './ChatbotPage.css';

function ChatbotPage(): JSX.Element {
    const [messages, setMessages] = useState<IMessage[]>(chatStore.getState().messages);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const user = authService.getLoggedInUser();

    const userAvatar = user?.profileImage
        ? (user.profileImage.startsWith('http') ? user.profileImage : `${appConfig.apiAddress}/uploads/${user.profileImage}`)
        : defaultAvatar;

    useEffect(() => {
        const unsubscribe = chatStore.subscribe(() => {
            setMessages(chatStore.getState().messages);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        const el = messagesContainerRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [messages]);

    function clearChat(): void {
        chatStore.dispatch({ type: ChatActionType.ClearMessages });
        localStorage.removeItem('chatState');
    }

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
            chatStore.dispatch({ type: ChatActionType.AddMessage, payload: { id: crypto.randomUUID(), text: 'Sorry, something went wrong. Please try again.', sender: 'bot' } });
        } finally {
            setIsLoading(false);
        }
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
        if (event.key === 'Enter') sendMessage();
        if (event.key === 'Escape') setInputText('');
    }

    return (
        <div className="chatbot-page-wrapper" style={{ backgroundImage: `url(${commandCenter})` }}>
        <div className="chatbot-page">
            <div className="chatbot-page-header">
                <div className="chatbot-header-content">
                    <h1>GuitarBot</h1>
                    <p>Your personal guitar assistant</p>
                </div>
                {messages.length > 0 && (
                    <button className="chatbot-clear-btn" onClick={clearChat}>Clear</button>
                )}
            </div>
            <div className="chatbot-page-messages" ref={messagesContainerRef}>
                {messages.map(msg => (
                    <div key={msg.id} className={`chatbot-msg chatbot-msg--${msg.sender}`}>
                        {msg.sender === 'bot' && (
                            <img src={RobotImage} className="chatbot-avatar" alt="GuitarBot" />
                        )}
                        <div className="chatbot-msg-text">{msg.text}</div>
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
                <input
                    type="text"
                    placeholder="Ask about guitars, gear, technique..."
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="chatbot-input-field"
                />
                <button onClick={sendMessage} className="chatbot-send-btn">
                    Send
                </button>
            </div>
        </div>
        </div>
    );
}

export default ChatbotPage;
