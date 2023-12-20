import { useContext, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider/AuthProvider";
import { Link, useLocation, useNavigate } from "react-router-dom";

import loginImg from '../../assets/log.jpg'
import { AiOutlineEye } from 'react-icons/ai';
import SocialLogin from "../SocialLogin/SocialLogin";
import Swal from "sweetalert2";
import FadeIn from "../../Animation/FadeIn";


const Login = () => {
    const [loginLoading, SetLoginLoading] = useState(false)
    const [loginError, setLoginError] = useState('')
    const { signIn, loading } = useContext(AuthContext)
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
                Swal.fire({
                    title: 'Login Successful',
                    showClass: {
                        popup: 'animate__animated animate__fadeInDown'
                    },
                    hideClass: {
                        popup: 'animate__animated animate__fadeOutUp'
                    }
                })

                navigate(from, { replace: true });
                setLoginError('')
            })
            .catch(error => {

                const errorMessage = error.message;
                console.log(errorMessage)
                setLoginError(error)
            })
    }
    return (
        <div className="bg-blue-200/40 dark:glass">
            <div className=" container mx-auto px-2">
                <div className="flex justify-center items-center min-h-screen text-black">
                    <FadeIn delay={0.4} direction='down' >
                        <div className="bg-gray-100 flex items-center rounded-2xl shadow-lg max-w-3xl p-5">
                            {/* form  */}

                            <div className="md:w-1/2 px-8">
                                <h2 className="font-bold text-2xl uppercase">login</h2>
                                <p className="text-sm mt-4">If you already a memeber, easily login</p>

                                {/* form  */}
                                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                                    <input className="p-2 mt-8 rounded-xl border dark:bg-white" type="email" name="email" placeholder="Email" required />
                                    <div className="relative"
                                    >
                                        <input className="p-2 mt-3 rounded-xl border w-full dark:bg-white" type="password" name="password" placeholder="Password" required />
                                        {loginError && <div className="mt-2 text-red-600">Your password is wrong. Try again.</div>}
                                        {/* <div>
                                        <AiOutlineEye className="absolute top-1/2 right-3 -translate-y-1/2" />
                                    </div> */}
                                    </div>
                                    {
                                        loginLoading ? <><span className="loading loading-bars loading-lg mx-auto"></span></> : <input className="bg-blue-400 rounded-xl py-2 hover:scale-105 duration-300" type="submit" value="Login" />
                                    }

                                </form>
                                <div className="mt-10 grid  grid-cols-3 items-center text-gray-500">
                                    <hr className="border-gray-500" />
                                    <p className="text-center text-sm">OR</p>
                                    <hr className="border-gray-500" />
                                </div>
                                {/* social login  */}
                                <div>
                                    <SocialLogin></SocialLogin>
                                </div>
                                <p className="mt-5 text-xs border-b py-4">
                                    Forgot Your Password?
                                </p>
                                <div className="text-xm flex justify-between items-center mt-3">
                                    <p>
                                        Don't have an account
                                    </p>
                                    <Link to='/signup'>
                                        <button className="py-2 bg-white px-2 border rounded-xl hover:scale-110 duration-300">Register</button></Link>
                                </div>
                            </div>

                            {/* image  */}
                            <div className="md:block hidden w-1/2 ">
                                <img className=" rounded-2xl" src={loginImg} alt="" />
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </div>
    );
};

export default Login;

{/* <div className=" w-full max-w-md shadow-2xl rounded-xl px-6 py-6 min-h-80 bg-white">
                        <div className="flex flex-col text-center border-4 border-orange-600 rounded-full w-[200px] h-[200px] mx-auto">
                            <div className="mx-auto w-32">
                                <img src={logo} alt="logo" className=" " />

                            </div>
                            <div>
                                <div className="text-xl font-bold ">Book Ocean BD</div>
                            </div>
                        </div>
                        <div className="text-3xl font-semibold text-center my-4 border-b-2 pb-2 text-blue-400 ">
                            LOGIN
                        </div>
                        <form onSubmit={handleLogin} className="flex flex-col justify-center items-center ">
                            <div className="flex flex-col mb-4">
                                <label className="mb-2">
                                    <span className="">Email</span>
                                </label>
                                <input name='email' type="email" placeholder="email" className=" border w-80 p-2" required />
                            </div>
                            <div className="flex flex-col mb-4">
                                <label className="mb-2">
                                    <span className="">Password</span>
                                </label>
                                <input name='password' type="password" placeholder="password" className="border  w-80 p-2" required />
                                <label className=" mt-4">
                                    <a href="#" className="">Forgot password?</a>
                                </label>
                            </div>


                        </form>
                        <p className="text-xl"><small>New Here? <Link to='/signup' className="text-blue-600">Create an account</Link></small></p>
                    </div> */}