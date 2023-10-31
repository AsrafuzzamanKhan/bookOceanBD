import { useForm } from 'react-hook-form';
import logo from '../../assets/logo/book.png'
import { Link } from 'react-router-dom';

const SignUp = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    const onSubmit = (data) => { console.log(data) }
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
                        <div className="text-3xl font-semibold text-center my-4 border-b-2 pb-2 text-blue-400 uppercase">
                            Register
                        </div>
                        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Name</span>
                                </label>
                                <input
                                    name='name'
                                    type="text"
                                    {...register("name", { required: true })}
                                    placeholder="Name"
                                    className="input input-bordered" />
                                {errors.name && <span>Name is required</span>}
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input
                                    name='email'
                                    type="email"
                                    {...register("email", { required: true })}
                                    placeholder="email"
                                    className="input input-bordered" />
                                {errors.email && <span> Email is required</span>}

                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <input
                                    name='password'
                                    type="password"
                                    {...register("password", { required: true, minLength: 6, maxLength: 20 })}
                                    placeholder="password"
                                    className="input input-bordered" />
                                {errors.password?.type === "required" && (
                                    <p role="alert">password is required</p>
                                )}
                                <label className="label">
                                    <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                                </label>
                            </div>
                            {errors.name && <span>Name is required</span>}
                            <div className="form-control mt-6">
                                <button className="btn btn-primary">Login</button>
                            </div>
                        </form>
                        <p className="text-xl"><small>New Here? <Link to='/login' className="text-blue-600">Create an account</Link></small></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;