import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Helmet } from "react-helmet-async";
import { showSuccessToast } from "../../../utils/toast";
import { AiFillDelete } from "react-icons/ai";
import { FaUserShield } from "react-icons/fa";

const UserTable = ({ title, users, showMakeAdmin, onMakeAdmin, onDelete }) => (
    <div className='mb-10'>
        <h2 className='text-lg font-semibold mb-3 dark:text-white'>{title} ({users.length})</h2>
        <div className="overflow-x-auto border dark:border-0 dark:bg-gray-800 rounded-[8px]">
            <table className="table  lg:text-[16px] lg:table-lg table-xs overflow-x-auto">
                <thead>
                    <tr className='dark:text-white'>
                        <th>S/N</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.length === 0
                            ? <tr><td colSpan={5} className='text-center py-6 text-gray-500 dark:text-gray-400'>No {title.toLowerCase()} yet.</td></tr>
                            : users.map((user, i) => <tr key={user._id || i} className='dark:text-white dark:hover:bg-gray-700 hover:bg-gray-100 duration-300'>
                                <th>{i + 1}</th>
                                <td>{user.name}</td>
                                <td className="w-28 ">{user.email}</td>
                                <td>
                                    {user.role === 'admin'
                                        ? <span className='badge bg-blue-500 text-white border-0'>Admin</span>
                                        : showMakeAdmin && <button onClick={() => onMakeAdmin(user)} className="btn bg-orange-600 text-white"><FaUserShield className="text-2xl" size={15}></FaUserShield></button>
                                    }
                                </td>
                                <th>
                                    <button onClick={() => onDelete(user)} className="btn bg-red-600 text-white"> <AiFillDelete size={15} /></button>
                                </th>
                            </tr>)
                    }
                </tbody>
            </table>
        </div>
    </div>
);

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
                    showSuccessToast(`${user.name} is an Admin Now!`)
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
                    showSuccessToast("Removed!", "User has removed")
                }

            })
    }

    const admins = users.filter(u => u.role === 'admin');
    const regularUsers = users.filter(u => u.role !== 'admin');

    return (
        <div className="container mx-auto">
            <Helmet>
                <title>Book Ocean BD || All Users</title>
            </Helmet>

            <div className="mb-[30px] pt-24 md:pt-28 lg:pt-0 xl:pt-24 min-h-screen px-2 lg:px-0">
                <div className=' flex flex-col items-center  mb-8 '>
                    <h1 className=' bg-slate-800 text-white px-8 py-3 rounded'>Total User:  {users?.length}</h1>
                </div>

                <UserTable title='Admins' users={admins} showMakeAdmin={false} onMakeAdmin={handleMakeAdmin} onDelete={handleDelete} />
                <UserTable title='Users' users={regularUsers} showMakeAdmin={true} onMakeAdmin={handleMakeAdmin} onDelete={handleDelete} />
            </div>
        </div>
    );
};

export default AllUsers;
