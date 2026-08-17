import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { showSuccessToast, showErrorToast, showWarningToast } from '../../../utils/toast';
import { FaRegUserCircle } from 'react-icons/fa';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

// same Bangladeshi mobile format used at checkout - 11 digits, starting 01[3-9]
const BD_PHONE_PATTERN = /^01[3-9]\d{8}$/;

const ProfileForm = ({ user, profile, axiosSecure, updateUserProfile, refreshUser }) => {
    const [isSaving, setIsSaving] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: { name: user?.displayName || '', phone: '', address: '', gender: '' },
    });

    // profile loads asynchronously (GET /users/profile) - fill the form once it arrives
    useEffect(() => {
        if (profile) {
            reset({
                name: profile.name || user?.displayName || '',
                phone: profile.phone || '',
                address: profile.address || '',
                gender: profile.gender || '',
            });
        }
    }, [profile, user, reset]);

    const onSubmit = async (data) => {
        setIsSaving(true);
        try {
            // Firebase (source of truth for auth display name) ...
            await updateUserProfile(data.name, user?.photoURL || '');
            // ...and Mongo (source of truth for the admin's user list + the extra fields)
            await axiosSecure.patch('/users/profile', data);
            await refreshUser();
            showSuccessToast('Profile updated');
        } catch (err) {
            console.error(err);
            showErrorToast('Could not update profile', err.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm p-6">
            <div className="flex flex-col items-center gap-3 mb-6">
                <div className="avatar">
                    <div className="w-24 h-24 rounded-full ring-2 ring-blue-400 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 bg-neutral text-neutral-content overflow-hidden">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt={user?.displayName} referrerPolicy="no-referrer" />
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <FaRegUserCircle className="text-4xl" />
                            </div>
                        )}
                    </div>
                </div>
                <div className="text-center">
                    <p className="font-semibold text-gray-900 dark:text-white">{user?.displayName || 'Welcome'}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full name*</label>
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        {...register('name', { required: true })}
                    />
                    {errors.name && <span className="text-red-600 text-xs font-medium mt-1 block">Name is required</span>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                    <input
                        type="email"
                        disabled
                        value={user?.email || ''}
                        className="input input-bordered w-full bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone number</label>
                    <input
                        type="tel"
                        inputMode="numeric"
                        placeholder="e.g. 01712345678"
                        className="input input-bordered w-full"
                        {...register('phone', { pattern: BD_PHONE_PATTERN })}
                    />
                    {errors.phone && <span className="text-red-600 text-xs font-medium mt-1 block">Enter a valid Bangladeshi phone number, e.g. 01712345678</span>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Address</label>
                    <textarea
                        className="input input-bordered w-full h-24 py-2"
                        placeholder="Enter full address"
                        {...register('address')}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Gender</label>
                    <select className="select select-bordered w-full" {...register('gender')}>
                        <option value="">Prefer not to say</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={isSaving}
                    className="mt-2 h-12 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isSaving ? 'Saving...' : 'Save changes'}
                </button>
            </form>
        </div>
    );
};

const ChangePasswordForm = ({ user, changePassword, resetPassword }) => {
    const [isSaving, setIsSaving] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
    const newPassword = watch('newPassword');

    const onSubmit = async (data) => {
        setIsSaving(true);
        try {
            await changePassword(data.currentPassword, data.newPassword);
            reset();
            showSuccessToast('Password updated');
        } catch (err) {
            console.error(err);
            const message = err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password'
                ? 'Your current password is incorrect.'
                : err.code === 'auth/weak-password'
                    ? 'Please choose a stronger password (at least 6 characters).'
                    : err.message;
            showErrorToast('Could not update password', message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleForgotPassword = () => {
        if (!user?.email) return;
        resetPassword(user.email)
            .then(() => showSuccessToast('Password reset email sent', `Check ${user.email} for a reset link.`))
            .catch(() => showWarningToast('Could not send reset email', 'Please try again in a moment.'));
    };

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm p-6">
            <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-5">Change password</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Current password*</label>
                    <div className="relative">
                        <input
                            type={showCurrent ? 'text' : 'password'}
                            className="input input-bordered w-full pr-10"
                            {...register('currentPassword', { required: true })}
                        />
                        <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                            {showCurrent ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                        </button>
                    </div>
                    {errors.currentPassword && <span className="text-red-600 text-xs font-medium mt-1 block">Current password is required</span>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">New password*</label>
                    <div className="relative">
                        <input
                            type={showNew ? 'text' : 'password'}
                            className="input input-bordered w-full pr-10"
                            {...register('newPassword', { required: true, minLength: 6 })}
                        />
                        <button type="button" onClick={() => setShowNew(!showNew)} className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                            {showNew ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                        </button>
                    </div>
                    {errors.newPassword && <span className="text-red-600 text-xs font-medium mt-1 block">Password must be at least 6 characters</span>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm new password*</label>
                    <input
                        type={showNew ? 'text' : 'password'}
                        className="input input-bordered w-full"
                        {...register('confirmPassword', {
                            required: true,
                            validate: (value) => value === newPassword || 'Passwords do not match',
                        })}
                    />
                    {errors.confirmPassword && <span className="text-red-600 text-xs font-medium mt-1 block">{errors.confirmPassword.message}</span>}
                </div>

                <button
                    type="submit"
                    disabled={isSaving}
                    className="h-12 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isSaving ? 'Updating...' : 'Update password'}
                </button>

                <button type="button" onClick={handleForgotPassword} className="text-xs text-blue-500 hover:underline text-center">
                    Forgot your current password? Send a reset email instead.
                </button>
            </form>
        </div>
    );
};

const MyProfile = () => {
    const { user, updateUserProfile, refreshUser, changePassword, resetPassword } = useAuth();
    const [axiosSecure] = useAxiosSecure();

    const { data: profile } = useQuery({
        queryKey: ['myProfile', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get('/users/profile');
            return res.data;
        },
    });

    // Google/other social accounts have no password to change - only email/password
    // accounts carry a 'password' entry in providerData.
    const hasPasswordProvider = user?.providerData?.some((p) => p.providerId === 'password');

    return (
        <div className="pt-32 md:pt-32 lg:pt-24 pb-16 bg-gray-50 dark:bg-gray-950/40 min-h-screen">
            <Helmet>
                <title>Book Ocean BD | My Profile</title>
            </Helmet>
            <div className="container mx-auto px-4 lg:px-0">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account details and security.</p>
                </div>

                <div className={`max-w-4xl mx-auto grid gap-6 ${hasPasswordProvider ? 'lg:grid-cols-2' : 'max-w-md'}`}>
                    <ProfileForm
                        user={user}
                        profile={profile}
                        axiosSecure={axiosSecure}
                        updateUserProfile={updateUserProfile}
                        refreshUser={refreshUser}
                    />

                    {hasPasswordProvider && (
                        <ChangePasswordForm user={user} changePassword={changePassword} resetPassword={resetPassword} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
