import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";
import { AiFillDelete } from "react-icons/ai";
import { FaUserShield } from "react-icons/fa";

const AllUsers = () => {
    const [axiosSecure] = useAxiosSecure();
    const { data: users = [], refetch } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users')
            return res.data;

        }
    });
    const handleMakeAdmin = user => {
        console.log(user._id)
        axiosSecure.patch(`/users/admin/${user._id}`)
            .then(res => {
                console.log(res.data)
                if (res.data.modifiedCount > 0) {
                    refetch();
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: `${user.name} is an Admin Now!`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            })
    }

    const handleDelete = user => {
        console.log(user)
    }
    return (
        <div className="w-full">
            <Helmet>
                <title>Book Ocean BD || All Users</title>
            </Helmet>
            <div className=" text-white text-2xl font-bold text-center mb-12 bg-[#081A51] py-12">
                Total User: {users?.length}
            </div>

            <div className="px-6 pb-12">
                <div className="overflow-x-auto">
                    <table className="table table-zebra">
                        {/* head */}
                        <thead>
                            <tr>
                                <th>S/N</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                users?.map((user, i) => <tr key={i}>
                                    <th>{i + 1}</th>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role === 'admin' ? 'admin' : <button onClick={() => handleMakeAdmin(user)} className="btn bg-orange-600 text-white"><FaUserShield className="text-2xl"></FaUserShield></button>}</td>
                                    <th>
                                        <button onClick={() => handleDelete(user)} className="btn bg-red-600 text-white"> <AiFillDelete className='text-2xl' /></button>
                                    </th>
                                </tr>)
                            }


                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AllUsers;