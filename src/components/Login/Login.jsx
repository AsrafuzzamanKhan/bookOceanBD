import { useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider/AuthProvider";
import { Link } from "react-router-dom";
import logo from '../../assets/logo/book.png'

const Login = () => {
    const { signIn, loading } = useContext(AuthContext)
    const handleLogin = event => {
        event.preventDefault();
        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;
        console.log(email, password)
        signIn(email, password)
            .then(result => {
                const user = result.user
                console.log(user)
            })
            .catch(error => {

                const errorMessage = error.message;
                console.log(errorMessage)
            })
    }
    return (
        <div className="bg-blue-200/40">
            <div className=" container mx-auto px-2">
                <div className="flex justify-center items-center h-[100vh] ">
                    <div className=" w-full max-w-md shadow-2xl rounded-xl px-6 py-6 min-h-80 bg-white">
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;