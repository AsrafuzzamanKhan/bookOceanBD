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
        fetch(`https://book-ocean-bd-server.vercel.app/users/${user._id}`, {
            method: "DELETE"
        })
            .then(res => res.json())
            .then(data => {
                if (data.deletedCount > 0) {

                    refetch()
                    Swal.fire({
                        title: "Removed!",
                        text: "User has removed",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500

                    });
                }

            })
    }
    return (
        <div className="container mx-auto">
            <Helmet>
                <title>Book Ocean BD || All Users</title>
            </Helmet>

            <div className="mb-[30px] pt-24 md:pt-28 lg:pt-0 xl:pt-24 min-h-screen">
                <div className=' flex flex-col items-center  mb-8 '>
                    <h1 className=' bg-slate-800 text-white px-8 py-3 rounded'>Total User:  {users?.length}</h1>
                </div>
                {/* table  */}
                <div className=" pb-12 px-[2vw]">
                    <div className="overflow-x-auto border ">
                        <table className="table  lg:text-[16px] lg:table-lg table-xs overflow-x-auto">
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
                                        <td className="w-28 ">{user.email}</td>
                                        <td>{user.role === 'admin' ? 'admin' : <button onClick={() => handleMakeAdmin(user)} className="btn bg-orange-600 text-white"><FaUserShield className="text-2xl" size={15}></FaUserShield></button>}</td>
                                        <th>
                                            <button onClick={() => handleDelete(user)} className="btn bg-red-600 text-white"> <AiFillDelete size={15} /></button>
                                        </th>
                                    </tr>)
                                }


                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AllUsers;