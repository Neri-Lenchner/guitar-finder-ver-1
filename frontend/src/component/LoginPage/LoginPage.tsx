import { JSX, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { ICredentials } from '../../models/user.model';
import guitarGod from '../../assets/guitar-god.png';
import AlertModal from '../AlertModal/AlertModal';
import './LoginPage.css';

function LoginPage(): JSX.Element {
    const { register, handleSubmit } = useForm<ICredentials>();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');

    async function onSubmit(credentials: ICredentials): Promise<void> {
        try {
            await authService.login(credentials);
            navigate('/home');
        } catch (error: any) {
            setAlertMsg(error.response?.data?.message || 'Login failed');
        }
    }

    return (
        <>
        {alertMsg && <AlertModal message={alertMsg} onClose={() => setAlertMsg('')} />}
        <div className="login-page">
            <div className="login-inner">
                <div className="login-card">
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                        <input type="email" placeholder="Email" {...register('email', { required: true })} />
                        <div className="password-wrapper">
                            <input type={showPassword ? 'text' : 'password'} placeholder="Password" {...register('password', { required: true })} />
                            <button type="button" className="password-toggle" onClick={() => setShowPassword(v => !v)}>
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                                        <line x1="1" y1="1" x2="23" y2="23"/>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                        <circle cx="12" cy="12" r="3"/>
                                    </svg>
                                )}
                            </button>
                        </div>
                        <button type="submit">Login</button>
                    </form>
                    <p>Don't have an account? <Link to="/register">Register</Link></p>
                </div>
                <img src={guitarGod} alt="" aria-hidden="true" className="login-guitar" />
            </div>
        </div>
        </>
    );
}

export default LoginPage;
