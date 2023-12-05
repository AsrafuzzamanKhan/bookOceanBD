import { useContext } from "react";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "../../providers/AuthProvider/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";

const SocialLogin = () => {
    const { googleSignIn } = useContext(AuthContext)
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const handleGoogleSigIn = () => {
        googleSignIn()
            .then(result => {
                const loggedGoogleUser = result.user;
                // console.log('google login user: ', loggedGoogleUser)
                const saveUser = { name: loggedGoogleUser.displayName, email: loggedGoogleUser.email }
                // console.log('saveUser', saveUser);
                fetch('https://book-ocean-bd-server.vercel.app/users', {
                    method: "POST",
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(saveUser)
                })
                    .then(res => res.json())
                    .then(() => {
                        navigate(from, { replace: true });
                    })
            })

    }
    return (
        <div>
            <button
                onClick={handleGoogleSigIn}
                className="bg-white border p-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300"><FcGoogle className="text-3xl mr-3" /> Login with Google</button>
        </div>
    );
};

export default SocialLogin;