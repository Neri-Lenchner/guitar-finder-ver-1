import { JSX, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import guitarGod from '../../assets/guitar-god.png';
import './EditProfilePage.css';

interface IEditProfileForm {
    firstName: string;
    lastName: string;
    profileImage: FileList;
}

function EditProfilePage(): JSX.Element {
    const user = authService.getLoggedInUser();
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm<IEditProfileForm>({
        defaultValues: { firstName: user?.firstName ?? '', lastName: user?.lastName ?? '' },
    });
    const profileImageRegister = register('profileImage');

    const currentImage = user?.profileImage ?? null;

    const [preview, setPreview] = useState<string | null>(currentImage);

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>): void {
        profileImageRegister.onChange(e);
        const file = e.target.files?.[0];
        if (file) setPreview(URL.createObjectURL(file));
        else setPreview(currentImage);
    }

    async function onSubmit(data: IEditProfileForm): Promise<void> {
        try {
            await authService.updateProfile(user!._id, {
                firstName: data.firstName,
                lastName: data.lastName,
                profileImage: data.profileImage?.[0],
            });
            navigate('/home');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Update failed');
        }
    }

    return (
        <div className="edit-profile-page">
            <div className="edit-profile-inner">
            <div className="edit-profile-card">
                <h2>Edit Profile</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="edit-profile-form">
                    <div className="edit-profile-avatar-picker">
                        <img
                            src={preview ?? guitarGod}
                            alt="Profile"
                            className="edit-profile-avatar-preview"
                        />
                        <label className="edit-profile-avatar-label">
                            Change photo
                            <input
                                type="file"
                                accept="image/*"
                                {...profileImageRegister}
                                onChange={handleImageChange}
                                className="edit-profile-avatar-input"
                            />
                        </label>
                    </div>
                    <input type="text" placeholder="First Name" {...register('firstName', { required: true })} />
                    <input type="text" placeholder="Last Name" {...register('lastName', { required: true })} />
                    <div className="edit-profile-actions">
                        <button type="submit">Save Changes</button>
                        <button type="button" onClick={() => navigate(-1)} className="edit-profile-cancel">Cancel</button>
                    </div>
                </form>
            </div>
            <img src={guitarGod} alt="" aria-hidden="true" className="edit-profile-guitar" />
            </div>
        </div>
    );
}

export default EditProfilePage;
