import { JSX, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authStore } from '../../state/auth.state';
import guitarGod from '../../assets/guitar-god.png';
import './UserAvatar.css';

function UserAvatar(): JSX.Element {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(authStore.getState().user);

    useEffect(() => {
        const unsubscribe = authStore.subscribe(() => {
            setUser(authStore.getState().user);
        });
        return unsubscribe;
    }, []);

    if (pathname === '/chatbot') return <></>;

    return (
        <div className={`user-avatar-fixed${user ? ' user-avatar-fixed--visible' : ''}`} onClick={() => user && navigate('/edit-profile')}>
            <img
                src={user?.profileImage ?? guitarGod}
                alt={user?.firstName ?? ''}
            />
        </div>
    );
}

export default UserAvatar;
