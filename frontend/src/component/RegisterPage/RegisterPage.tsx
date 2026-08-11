import { JSX } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { IUserRegister } from '../../models/user.model';
import './RegisterPage.css';

function RegisterPage(): JSX.Element {
    const { register, handleSubmit } = useForm<IUserRegister>();
    const navigate = useNavigate();

    async function onSubmit(userData: IUserRegister): Promise<void> {
        try {
            await authService.register(userData);
            navigate('/home');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Registration failed');
        }
    }

    return (
        <div className="register-page">
            <div className="register-card">
                <h2>Register</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="register-form">
                    <input type="text" placeholder="First Name" {...register('firstName', { required: true })} />
                    <input type="text" placeholder="Last Name" {...register('lastName', { required: true })} />
                    <input type="email" placeholder="Email" {...register('email', { required: true })} />
                    <input type="password" placeholder="Password" {...register('password', { required: true })} />
                    <button type="submit">Register</button>
                </form>
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    );
}

export default RegisterPage;
