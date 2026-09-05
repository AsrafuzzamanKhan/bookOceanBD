import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { Helmet } from "react-helmet-async";
import { showSuccessToast, showErrorToast, showConfirm } from "../../../utils/toast";
import { AiFillDelete } from "react-icons/ai";
import { FaUserShield } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import Pagination from "../../Pagination/Pagination";

const USERS_PER_PAGE = 30;

// Mongo ObjectIds encode their creation time in the first 4 bytes - so
// "newest first" can be derived straight from _id with no schema/backend
// change needed (the users collection has never stored a createdAt field).
const createdAtFromId = (id) => (id ? parseInt(String(id).slice(0, 8), 16) * 1000 : 0);

const RoleBadge = ({ role }) => role === 'admin'
    ? <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Admin</span>
    : <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">User</span>;

const AllUsers = () => {
    const [axiosSecure] = useAxiosSecure();
    const { user: currentUser } = useAuth();
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    const { data: users = [], refetch } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users')
            return res.data;
        }
    });

    const handleMakeAdmin = user => {
        axiosSecure.patch(`/users/admin/${user._id}`)
            .then(res => {
                if (res.data.modifiedCount > 0) {
                    refetch();
                    showSuccessToast(`${user.name} is an Admin Now!`)
                }
            })
    }

    // deleting a user is permanent and unrecoverable - confirm first, same
    // pattern used for order cancellation elsewhere in the dashboard
    const handleDelete = user => {
        showConfirm({
            title: `Delete ${user.name || user.email}?`,
            text: "This permanently removes their account. This can't be undone.",
            confirmText: "Yes, delete",
            danger: true,
        }).then((confirmed) => {
            if (!confirmed) return;

            axiosSecure.delete(`/users/${user._id}`)
                .then(res => {
                    if (res.data.deletedCount > 0) {
                        refetch()
                        showSuccessToast("Removed!", `${user.name || user.email} has been removed.`)
                    }
                })
                .catch(err => {
                    console.error(err);
                    showErrorToast("Could not delete user", "Please try again.")
                })
        });
    }

    const sortedUsers = useMemo(
        () => [...users].sort((a, b) => createdAtFromId(b._id) - createdAtFromId(a._id)),
        [users]
    );

    const admins = sortedUsers.filter(u => u.role === 'admin');
    const regularUsers = sortedUsers.filter(u => u.role !== 'admin');

    const searchTerm = search.trim().toLowerCase();
    const visibleUsers = sortedUsers
        .filter(u => roleFilter === 'all' || (roleFilter === 'admin' ? u.role === 'admin' : u.role !== 'admin'))
        .filter(u => {
            if (!searchTerm) return true;
            return [u.name, u.email].filter(Boolean).join(' ').toLowerCase().includes(searchTerm);
        });

    const pageStart = (currentPage - 1) * USERS_PER_PAGE;
    const pageUsers = visibleUsers.slice(pageStart, pageStart + USERS_PER_PAGE);

    const hasActiveFilters = roleFilter !== 'all' || !!search;
    const clearFilters = () => { setSearch(''); setRoleFilter('all'); setCurrentPage(1); };

    const filters = [
        { key: 'all', label: 'All', count: sortedUsers.length },
        { key: 'admin', label: 'Admins', count: admins.length },
        { key: 'user', label: 'Users', count: regularUsers.length },
    ];

    return (
        <div className="container mx-auto">
            <Helmet>
                <title>Book Ocean BD || All Users</title>
            </Helmet>

            <div className="mb-[30px] pt-24 md:pt-28 lg:pt-0 xl:pt-24 min-h-screen px-2 lg:px-0">
                <div className='flex flex-col items-center mb-8'>
                    <h1 className='bg-slate-800 text-white px-8 py-3 rounded'>Total Users: {sortedUsers.length}</h1>
                </div>

                {/* role filter - flex-wrap so it stays fully reachable on
                    narrow screens instead of scrolling off-screen */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                    {filters.map(({ key, label, count }) => (
                        <button
                            key={key}
                            onClick={() => { setRoleFilter(key); setCurrentPage(1); }}
                            className={`text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full duration-200 ${roleFilter === key
                                ? 'bg-slate-800 text-white'
                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                            {label} ({count})
                        </button>
                    ))}
                </div>

                {/* search */}
                <div className="max-w-sm mx-auto mb-8 relative">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                        placeholder="Search by name or email..."
                        className="w-full h-11 pl-10 pr-4 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {visibleUsers.length === 0 ? (
                    <div className="max-w-md mx-auto text-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm py-16 px-6">
                        <FiSearch className="text-6xl text-gray-200 dark:text-gray-700 mx-auto mb-4" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No users found</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Try a different search term or filter.</p>
                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors duration-200"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* desktop: dense table */}
                        <div className="hidden lg:block">
                            <div className="overflow-x-auto border dark:border-0 dark:bg-gray-800 rounded-[8px]">
                                <table className="table lg:text-[16px] lg:table-lg table-xs">
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
                                        {pageUsers.map((user, i) => (
                                            <tr key={user._id || i} className='dark:text-white dark:hover:bg-gray-700 hover:bg-gray-100 duration-300'>
                                                <th>{pageStart + i + 1}</th>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td><RoleBadge role={user.role} /></td>
                                                <td>
                                                    <div className="flex items-center gap-2">
                                                        {user.role !== 'admin' && (
                                                            <button onClick={() => handleMakeAdmin(user)} className="btn btn-sm bg-orange-600 hover:bg-orange-700 text-white border-0" title="Make admin">
                                                                <FaUserShield size={14} />
                                                            </button>
                                                        )}
                                                        {user.email === currentUser?.email ? (
                                                            <span className="text-xs text-gray-400 italic px-2">You</span>
                                                        ) : (
                                                            <button onClick={() => handleDelete(user)} className="btn btn-sm bg-red-600 hover:bg-red-700 text-white border-0" title="Delete user">
                                                                <AiFillDelete size={14} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* mobile: stacked cards */}
                        <div className="lg:hidden flex flex-col gap-3">
                            {pageUsers.map((user, i) => (
                                <div key={user._id || i} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                                        </div>
                                        <RoleBadge role={user.role} />
                                    </div>
                                    <div className="flex items-center gap-2 mt-3">
                                        {user.role !== 'admin' && (
                                            <button
                                                onClick={() => handleMakeAdmin(user)}
                                                className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-orange-50 hover:bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:hover:bg-orange-900/50 dark:text-orange-300 transition-colors duration-200"
                                            >
                                                <FaUserShield size={12} /> Make admin
                                            </button>
                                        )}
                                        {user.email === currentUser?.email ? (
                                            <span className="flex-1 text-center text-xs text-gray-400 italic">This is you</span>
                                        ) : (
                                            <button
                                                onClick={() => handleDelete(user)}
                                                className={`${user.role !== 'admin' ? '' : 'flex-1'} flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-300 transition-colors duration-200`}
                                            >
                                                <AiFillDelete size={12} /> Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                <Pagination
                    totalPosts={visibleUsers.length}
                    postsPerPage={USERS_PER_PAGE}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </div>
        </div>
    );
};

export default AllUsers;
