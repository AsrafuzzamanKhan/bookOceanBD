import { useContext, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "../../providers/AuthProvider/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";

const SocialLogin = () => {
    const [googleLoading, setGoogleLoading] = useState(false)

    const { googleSignIn } = useContext(AuthContext)
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const handleGoogleSigIn = () => {
        setGoogleLoading(true)
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
        <button
            type="button"
            onClick={handleGoogleSigIn}
            disabled={googleLoading}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700/40 text-sm font-semibold text-gray-700 dark:text-gray-200 transition hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-70">
            {
                googleLoading ? <>
                    <span className="loading loading-ball loading-xs"></span>
                    <span className="loading loading-ball loading-sm"></span>
                    <span className="loading loading-ball loading-md"></span>
                </>
                    : <><FcGoogle size={20} />Continue with Google</>
            }
        </button>
    );
};

export default SocialLogin;