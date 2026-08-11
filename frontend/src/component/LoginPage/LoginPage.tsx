import { JSX } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { ICredentials } from '../../models/user.model';
import './LoginPage.css';

function LoginPage(): JSX.Element {
    const { register, handleSubmit } = useForm<ICredentials>();
    const navigate = useNavigate();

    async function onSubmit(credentials: ICredentials): Promise<void> {
        try {
            await authService.login(credentials);
            navigate('/home');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Login failed');
        }
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <h2>Login</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                    <input type="email" placeholder="Email" {...register('email', { required: true })} />
                    <input type="password" placeholder="Password" {...register('password', { required: true })} />
                    <button type="submit">Login</button>
                </form>
                <p>Don't have an account? <Link to="/register">Register</Link></p>
            </div>
        </div>
    );
}

export default LoginPage;
