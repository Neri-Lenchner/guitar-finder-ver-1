import { JSX } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from '../component/HomePage/HomePage';
import LoginPage from '../component/LoginPage/LoginPage';
import RegisterPage from '../component/RegisterPage/RegisterPage';
import ChatbotPage from '../component/ChatbotPage/ChatbotPage';
import EditProfilePage from '../component/EditProfilePage/EditProfilePage';
import FooterPage from '../component/FooterPage/FooterPage';
import SearchPage from '../component/SearchPage/SearchPage';
import PrivateRoute from '../component/PrivateRoute';

function Routing(): JSX.Element {
    return (
        <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/chatbot" element={<PrivateRoute child={<ChatbotPage />} />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/edit-profile" element={<PrivateRoute child={<EditProfilePage />} />} />
            <Route path="/about" element={<FooterPage />} />
            <Route path="/contact" element={<FooterPage />} />
            <Route path="/faq" element={<FooterPage />} />
            <Route path="/privacy" element={<FooterPage />} />
            <Route path="/terms" element={<FooterPage />} />
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
    );
}

export default Routing;
