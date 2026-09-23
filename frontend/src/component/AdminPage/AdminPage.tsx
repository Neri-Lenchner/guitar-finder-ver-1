import { JSX, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { adminService, IAdminUser } from '../../services/admin.service';
import { statisticService, IGuitarStats } from '../../services/statistic.service';
import { appConfig } from '../../utils/app-config';
import guitarGod from '../../assets/guitar-god.png';
import defaultAvatar from '../../assets/default-avatar.png';
import AlertModal from '../AlertModal/AlertModal';
import Spinner from '../Spinner/Spinner';
import './AdminPage.css';

function avatarSrc(user: IAdminUser): string {
    if (!user.profileImage) return defaultAvatar;
    return user.profileImage.startsWith('http') ? user.profileImage : `${appConfig.apiAddress}/uploads/${user.profileImage}`;
}

function AdminPage(): JSX.Element {
    const currentUser = authService.getLoggedInUser();
    const [users, setUsers] = useState<IAdminUser[]>([]);
    const [stats, setStats] = useState<IGuitarStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [alertMsg, setAlertMsg] = useState('');

    useEffect(() => {
        if (!currentUser?.isAdmin) { setLoading(false); return; }
        Promise.all([adminService.getUsers(), statisticService.getStats()])
            .then(([usersData, statsData]) => {
                setUsers(usersData);
                setStats(statsData);
            })
            .catch(() => setAlertMsg('Failed to load admin data.'))
            .finally(() => setLoading(false));
    }, []);

    async function handleToggleAdmin(user: IAdminUser): Promise<void> {
        try {
            const updated = await adminService.setAdminStatus(user._id, !user.isAdmin);
            setUsers(prev => prev.map(u => (u._id === updated._id ? updated : u)));
        } catch (error: any) {
            setAlertMsg(error.response?.data?.message || 'Update failed.');
        }
    }

    async function handleDelete(user: IAdminUser): Promise<void> {
        if (!window.confirm(`Delete ${user.firstName} ${user.lastName}? This cannot be undone.`)) return;
        try {
            await adminService.deleteUser(user._id);
            setUsers(prev => prev.filter(u => u._id !== user._id));
        } catch (error: any) {
            setAlertMsg(error.response?.data?.message || 'Delete failed.');
        }
    }

    if (!currentUser?.isAdmin) {
        return (
            <div className="admin-page">
                <p className="admin-denied">Access denied. This page is for admins only.</p>
            </div>
        );
    }

    if (loading) return (
        <div className="admin-page">
            <img src={guitarGod} className="admin-bg-guitar" alt="" aria-hidden="true" />
            <Spinner text="Loading admin dashboard..." />
        </div>
    );

    return (
        <div className="admin-page">
            {alertMsg && <AlertModal message={alertMsg} onClose={() => setAlertMsg('')} />}
            <img src={guitarGod} className="admin-bg-guitar" alt="" aria-hidden="true" />
            <div className="admin-inner">
                <h1 className="admin-title">Admin <span>Dashboard</span></h1>

                {stats && (
                    <div className="admin-stats-row">
                        <div className="admin-stats-cards">
                            <div className="admin-stats-card">
                                <span className="admin-stats-value">{stats.totalListings.toLocaleString()}</span>
                                <span className="admin-stats-label">Total Listings</span>
                            </div>
                            <div className="admin-stats-card">
                                <span className="admin-stats-value">{stats.byBrand.length}</span>
                                <span className="admin-stats-label">Brands Tracked</span>
                            </div>
                            <div className="admin-stats-card">
                                <span className="admin-stats-value">{users.length}</span>
                                <span className="admin-stats-label">Registered Users</span>
                            </div>
                        </div>
                        <Link to="/stats" className="admin-stats-link">View full statistics &rarr;</Link>
                    </div>
                )}

                <h2 className="admin-section-title">Users</h2>
                <div className="admin-users-table-wrap">
                    <table className="admin-users-table">
                        <thead>
                            <tr>
                                <th>Avatar</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Joined</th>
                                <th>Admin</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id}>
                                    <td><img src={avatarSrc(u)} alt="" className="admin-user-avatar" /></td>
                                    <td>{u.firstName} {u.lastName}</td>
                                    <td>{u.email}</td>
                                    <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                                    <td>{u.isAdmin ? 'Yes' : 'No'}</td>
                                    <td className="admin-user-actions">
                                        <button
                                            className="admin-action-btn"
                                            onClick={() => handleToggleAdmin(u)}
                                            disabled={u._id === currentUser._id && u.isAdmin}
                                        >
                                            {u.isAdmin ? 'Demote' : 'Promote'}
                                        </button>
                                        <button
                                            className="admin-action-btn admin-action-btn--danger"
                                            onClick={() => handleDelete(u)}
                                            disabled={u._id === currentUser._id}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminPage;
