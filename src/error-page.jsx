import { Link, useRouteError } from "react-router-dom";
import { GrHomeRounded } from "react-icons/gr";

export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return (
        <div id="error-page" className="flex flex-col justify-center items-center min-h-screen gap-y-4">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
            <div className="bg-black text-white px-4 py-2 rounded-md hover:bg-slate-600 duration-500">  <Link to='/' className="flex justify-center items-center gap-x-2"> <GrHomeRounded fill="white" />Back to home</Link>
            </div>
        </div>
    );
}