import { JSX, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './App.css';
import Header from './component/layout/header/Header';
import Footer from './component/layout/footer/Footer';
import Routing from './utils/Routing';
import ChatbotWidget from './component/ChatbotWidget/ChatbotWidget';
import UserAvatar from './component/UserAvatar/UserAvatar';

function ScrollToTop(): null {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
    return null;
}

function App(): JSX.Element {
    return (
        <div className="App">
            <ScrollToTop />
            <header>
                <Header />
            </header>
            <main>
                <Routing />
            </main>
            <Footer />
            <ChatbotWidget />
            <UserAvatar />
        </div>
    );
}

export default App;
