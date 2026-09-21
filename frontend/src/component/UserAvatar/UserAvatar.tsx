import { JSX, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authStore } from '../../state/auth.state';
import { appConfig } from '../../utils/app-config';
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
        <button
            type="button"
            className={`user-avatar-fixed${user ? ' user-avatar-fixed--visible' : ''}`}
            onClick={() => user && navigate('/edit-profile')}
            disabled={!user}
            aria-label="Edit profile"
        >
            <img
                src={user?.profileImage ? (user.profileImage.startsWith('http') ? user.profileImage : `${appConfig.apiAddress}/uploads/${user.profileImage}`) : guitarGod}
                alt=""
            />
        </button>
    );
}

export default UserAvatar;
