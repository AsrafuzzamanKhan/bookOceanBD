import axios from 'axios';
import useAuth from './useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';


const axiosSecure = axios.create({
    baseURL: 'https://book-ocean-bd-server.vercel.app',
});

const useAxiosSecure = () => {
    const navigate = useNavigate();
    const { logOut } = useAuth()

    // request interceptor to add authorization header for every secure call to teh api
    axiosSecure.interceptors.request.use(function (config) {
        const token = localStorage.getItem('access-token')
        // console.log('request stopped by interceptors', token)
        config.headers.authorization = `Bearer ${token}`;
        return config;
    }, function (error) {
        // Do something with request error
        return Promise.reject(error);
    });


    // intercepts 401 and 403 status
    axiosSecure.interceptors.response.use(function (response) {
        return response;
    }, async (error) => {
        const status = error.response.status;
        // console.log('status error in the interceptor', status);
        // for 401 or 403 logout the user and move the user to the login
        if (status === 401 || status === 403) {
            await logOut();
            navigate('/login');
        }
        return Promise.reject(error);
    })


    return [axiosSecure]
};

export default useAxiosSecure;

// useEffect(() => {
//     axiosSecure.interceptors.request.use((config) => {
//         const token = localStorage.getItem('access-token');
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`
//         }
//         return config;
//     });
//     axiosSecure.interceptors.response.use((response) => response, async (error) => {

//         if (error.response && (error.response.status === 401 || error.response.status === 403)) {
//             await logOut();
//             navigate('/login')
//         }
//         return Promise.reject(error)

//     })
// }, [logOut, navigate])