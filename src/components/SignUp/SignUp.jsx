import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../../providers/AuthProvider/AuthProvider';
import { showSuccessToast } from '../../utils/toast';
import { Helmet } from 'react-helmet-async';
import SocialLogin from '../SocialLogin/SocialLogin';
import AuthLayout from '../Shared/AuthLayout/AuthLayout';
import AuthInput from '../Shared/AuthInput/AuthInput';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser } from 'react-icons/hi';

const SignUp = () => {
    const { createUser, updateUserProfile, sendVerificationEmail } = useContext(AuthContext)
    const [showPassword, setShowPassword] = useState(false)
    const [signupLoading, setSignupLoading] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm()
    const navigate = useNavigate()
    const onSubmit = (data) => {
        setSignupLoading(true)
        console.log(data);
        createUser(data.email, data.password)
            .then(result => {
                const loggedUser = result.user;
                console.log(loggedUser)
                updateUserProfile(data.name, data.photoURL)
                    .then(() => {
                        const saveUser = { name: data.name, email: data.email }
                        fetch('https://book-ocean-bd-server.vercel.app/users', {
                            method: 'POST',
                            headers: {
                                'content-type': 'application/json'
                            },
                            body: JSON.stringify(saveUser)
                        })
                            .then(res => res.json())
                            .then(data => {
                                console.log('new account', data)
                                if (data.insertedId) {
                                    reset();
                                    // fire-and-forget - a failed verification email shouldn't
                                    // block signup itself, and the verify-email banner lets
                                    // them resend later either way
                                    sendVerificationEmail(loggedUser.email).catch(err => console.log(err))
                                    showSuccessToast('Account Created Successfully', 'Check your email to verify your account.')
                                    navigate('/')
                                }
                                setSignupLoading(false)
                            })
                    })
                    .catch(error => {
                        console.log(error)
                        setSignupLoading(false)
                    })
            })
            .catch(error => {
                console.log(error)
                setSignupLoading(false)
            })
    }


    return (
        <>
            <Helmet>
                <title>Book Ocean BD | Sign up</title>
            </Helmet>
            <AuthLayout
                title="Create your account"
                subtitle="Join Book Ocean BD to start ordering original books."
            >
                <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>

                    {/* name  */}
                    <div>
                        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Full name
                        </label>
                        <AuthInput
                            icon={HiOutlineUser}
                            id="name"
                            type="text"
                            placeholder="Your full name"
                            autoComplete="name"
                            error={!!errors.name}
                            {...register("name", { required: true })}
                        />
                        {errors.name && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">Name is required</p>}
                    </div>

                    {/* email  */}
                    <div>
                        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email
                        </label>
                        <AuthInput
                            icon={HiOutlineMail}
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            error={!!errors.email}
                            {...register("email", { required: true })}
                        />
                        {errors.email && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">Email is required</p>}
                    </div>

                    {/* password  */}
                    <div>
                        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Password
                        </label>
                        <AuthInput
                            icon={HiOutlineLockClosed}
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            autoComplete="new-password"
                            error={!!errors.password}
                            rightElement={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                                </button>
                            }
                            {...register("password", {
                                required: true,
                                minLength: 6,
                                maxLength: 20,
                                pattern: /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z].)/
                            })}
                        />
                        {errors.password?.type === "required" && (
                            <p role="alert" className="mt-1.5 text-xs text-red-600 dark:text-red-400">Password is required</p>
                        )}
                        {errors.password?.type === 'minLength' && (
                            <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">Password must be at least 6 characters</p>
                        )}
                        {errors.password?.type === 'maxLength' && (
                            <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">Password must be under 20 characters</p>
                        )}
                        {errors.password?.type === 'pattern' && (
                            <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                                Must include an uppercase letter, lowercase letter, number and special character
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={signupLoading}
                        className="mt-1 flex h-12 w-full items-center justify-center rounded-xl bg-blue-600 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-70"
                    >
                        {signupLoading
                            ? <span className="loading loading-bars loading-md"></span>
                            : 'Create account'}
                    </button>
                </form>

                <div className="my-6 flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                    <hr className="flex-1 border-gray-200 dark:border-gray-700" />
                    or continue with
                    <hr className="flex-1 border-gray-200 dark:border-gray-700" />
                </div>

                <SocialLogin />

                <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                        Log in
                    </Link>
                </p>
            </AuthLayout>
        </>
    );
};

export default SignUp;
