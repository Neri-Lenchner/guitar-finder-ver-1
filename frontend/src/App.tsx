import { JSX } from 'react';
import './App.css';
import Header from './component/layout/header/Header';
import Footer from './component/layout/footer/Footer';
import Routing from './utils/Routing';
import ChatbotWidget from './component/ChatbotWidget/ChatbotWidget';

function App(): JSX.Element {
    return (
        <div className="App">
            <header>
                <Header />
            </header>
            <main>
                <Routing />
            </main>
            <Footer />
            <ChatbotWidget />
        </div>
    );
}

export default App;
