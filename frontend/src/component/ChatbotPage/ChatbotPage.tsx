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
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const user = authService.getLoggedInUser();

    const userAvatar: string = user?.profileImage
        ? (user.profileImage.startsWith('http') ? user.profileImage : `${appConfig.apiAddress}/uploads/${user.profileImage}`)
        : defaultAvatar;

    useEffect(() => {
        return chatStore.subscribe(() => {
            setMessages(chatStore.getState().messages);
        });
    }, []);

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    function clearChat(): void {
        chatStore.dispatch({ type: ChatActionType.ClearMessages });
        localStorage.removeItem('chatState');
    }

    async function sendMessage(): Promise<void> {
        if (!inputText.trim() || isLoading) return;

        const history = chatStore.getState().messages;
        const userMessage: IMessage = { id: crypto.randomUUID(), text: inputText, sender: 'user' };
        chatStore.dispatch({ type: ChatActionType.AddMessage, payload: userMessage });
        setInputText('');
        if (textareaRef.current) { textareaRef.current.style.height = 'auto'; }
        setIsLoading(true);

        try {
            const reply = await chatService.sendMessage(inputText, history);
            chatStore.dispatch({ type: ChatActionType.AddMessage, payload: { id: crypto.randomUUID(), text: reply, sender: 'bot' } });
        } catch {
            chatStore.dispatch({ type: ChatActionType.AddMessage, payload: { id: crypto.randomUUID(), text: 'Sorry, something went wrong. Please try again.', sender: 'bot' } });
        } finally {
            setIsLoading(false);
        }
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>): void {
        if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendMessage(); }
        if (event.key === 'Escape') setInputText('');
    }

    function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>): void {
        setInputText(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
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
                        <div className="chatbot-msg-text" dir="auto">{msg.text}</div>
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
                <button onClick={sendMessage} className="chatbot-send-btn">
                    Send
                </button>
            </div>
        </div>
        </div>
    );
}

export default ChatbotPage;
