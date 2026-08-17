import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider/AuthProvider";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import SocialLogin from "../SocialLogin/SocialLogin";
import AuthLayout from "../Shared/AuthLayout/AuthLayout";
import AuthInput from "../Shared/AuthInput/AuthInput";
import { showSuccessToast, showErrorToast, showWarningToast } from "../../utils/toast";


const Login = () => {
    const [loginLoading, SetLoginLoading] = useState(false)
    const [loginError, setLoginError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const emailRef = useRef(null)
    const { signIn, resetPassword } = useContext(AuthContext)
    // navigate user
    const navigate = useNavigate();
    const location = useLocation()
    const from = location.state?.from?.pathname || "/";
    const handleLogin = event => {
        event.preventDefault();
        SetLoginLoading(true)
        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;
        console.log(email, password)
        signIn(email, password)
            .then(result => {
                const user = result.user

                console.log(user)
                showSuccessToast('Login Successful')

                navigate(from, { replace: true });
                setLoginError('')
            })
            .catch(error => {

                const errorMessage = error.message;
                console.log(errorMessage)
                setLoginError(error)
                SetLoginLoading(false)
            })
    }

    // Firebase handles the actual reset link/page - we just trigger the email
    const handleForgotPassword = () => {
        const email = emailRef.current?.value;
        if (!email) {
            showWarningToast('Enter your email first', 'Type your email above, then click "Forgot password?" again.')
            return;
        }
        resetPassword(email)
            .then(() => {
                showSuccessToast('Password reset email sent', `Check ${email} for a reset link.`)
            })
            .catch(error => {
                console.log(error)
                showErrorToast('Could not send reset email', 'Please check the email address and try again.')
            })
    }
    return (
        <>
            <Helmet>
                <title>Book Ocean BD | Login</title>
            </Helmet>
            <AuthLayout
                title="Welcome back"
                subtitle="Log in to continue shopping and track your orders."
            >
                <form onSubmit={handleLogin} className="flex flex-col gap-5">
                    <div>
                        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email
                        </label>
                        <AuthInput
                            ref={emailRef}
                            icon={HiOutlineMail}
                            id="email"
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div>
                        <div className="mb-1.5 flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Password
                            </label>
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                Forgot password?
                            </button>
                        </div>
                        <AuthInput
                            icon={HiOutlineLockClosed}
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="••••••••"
                            autoComplete="current-password"
                            required
                            error={!!loginError}
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
                        />
                    </div>

                    {loginError && (
                        <p className="rounded-lg bg-red-50 dark:bg-red-900/20 px-3 py-2 text-sm text-red-600 dark:text-red-400">
                            Your email or password is incorrect. Please try again.
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loginLoading}
                        className="mt-1 flex h-12 w-full items-center justify-center rounded-xl bg-blue-600 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-70"
                    >
                        {loginLoading
                            ? <span className="loading loading-bars loading-md"></span>
                            : 'Log in'}
                    </button>
                </form>

                <div className="my-6 flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                    <hr className="flex-1 border-gray-200 dark:border-gray-700" />
                    or continue with
                    <hr className="flex-1 border-gray-200 dark:border-gray-700" />
                </div>

                <SocialLogin />

                <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    {"Don't have an account? "}
                    <Link to="/signup" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                        Create one
                    </Link>
                </p>
            </AuthLayout>
        </>
    );
};

export default Login;
