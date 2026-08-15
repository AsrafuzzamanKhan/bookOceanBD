import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { showSuccessToast, showErrorToast } from '../../../utils/toast';
import { FaRegUserCircle } from 'react-icons/fa';

const img_hosting_token = import.meta.env.VITE_image_Upload_token;
const img_hosting_url = `https://api.imgbb.com/1/upload?key=${img_hosting_token}`;

const MyProfile = () => {
    const { user, updateUserProfile, refreshUser } = useAuth();
    const [axiosSecure] = useAxiosSecure();
    const [isSaving, setIsSaving] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(user?.photoURL || '');

    const { register, handleSubmit } = useForm({
        defaultValues: { name: user?.displayName || '' },
    });

    // keep RHF's file registration working while also updating the preview
    const { onChange: rhfPhotoOnChange, ...photoRegister } = register('photo');
    const handlePhotoChange = (e) => {
        rhfPhotoOnChange(e);
        const file = e.target.files?.[0];
        if (file) setPhotoPreview(URL.createObjectURL(file));
    };

    const onSubmit = async (data) => {
        setIsSaving(true);
        try {
            let photoURL = user?.photoURL || '';

            if (data.photo?.[0]) {
                const formData = new FormData();
                formData.append('image', data.photo[0]);
                const imgRes = await fetch(img_hosting_url, { method: 'POST', body: formData }).then((r) => r.json());
                if (imgRes.success) photoURL = imgRes.data.display_url;
            }

            // Firebase (source of truth for auth display name/photo) ...
            await updateUserProfile(data.name, photoURL);
            // ...and Mongo (source of truth for the admin's user list) kept in sync
            await axiosSecure.patch('/users/profile', { name: data.name });
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
        <div className="container mx-auto">
            <Helmet>
                <title>Book Ocean BD || My Profile</title>
            </Helmet>
            <div className="mb-[30px] pt-28 md:pt-28 lg:pt-0 xl:pt-24 min-h-screen px-2 lg:px-0">
                <div className="text-center mb-8">
                    <h1 className="bg-slate-800 text-white px-8 py-3 rounded inline-block">My Profile</h1>
                </div>

                <div className="max-w-md mx-auto border dark:border-0 dark:bg-gray-800 rounded-lg shadow-xl p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <div className="flex flex-col items-center gap-2">
                            <div className="avatar">
                                <div className="w-24 rounded-full ring-2 ring-blue-400 bg-neutral text-neutral-content">
                                    {photoPreview ? (
                                        <img src={photoPreview} alt={user?.displayName} referrerPolicy="no-referrer" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <FaRegUserCircle className="text-4xl" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <label className="text-sm text-blue-500 cursor-pointer hover:underline">
                                Change photo
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    {...photoRegister}
                                    onChange={handlePhotoChange}
                                />
                            </label>
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-semibold dark:text-white">Name*</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered w-full dark:bg-white"
                                {...register('name', { required: true })}
                            />
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-semibold dark:text-white">Email</span>
                            </label>
                            <input
                                type="email"
                                disabled
                                value={user?.email || ''}
                                className="input input-bordered w-full bg-gray-100 dark:bg-gray-200 cursor-not-allowed"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="mt-2 py-3 rounded font-semibold bg-black dark:bg-gray-700 text-white hover:scale-95 duration-300 uppercase disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {isSaving ? 'Saving...' : 'Save changes'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
