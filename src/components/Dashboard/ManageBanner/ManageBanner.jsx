import { AiFillDelete } from "react-icons/ai";

import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Helmet } from "react-helmet-async";
import useBanner from "../../../hooks/useBanner";

const ManageBanner = () => {
    const [bannerData, , refetch] = useBanner()
    const [axiosSecure] = useAxiosSecure()


    const handleDeleteBook = book => {
        console.log('selected bookd', book._id)
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            console.log('result', result)
            if (result.isConfirmed) {
                axiosSecure.delete(`/banner/${book._id}`)
                    .then(res => {
                        if (res.data.deletedCount > 0) {
                            refetch();
                            Swal.fire(
                                'Deleted!',
                                'Your item has been deleted.',
                                'success'
                            )
                        }
                    })


            }
        })
    }
    return (
        <div className="container mx-auto">
            <Helmet>
                <title>Book Ocean BD || Manage Banner</title>
            </Helmet>
            <div className="mb-[30px] pt-28 md:pt-28 lg:pt-0 xl:pt-24 min-h-screen">
                <div className='items-center  mb-8 flex flex-col'>
                    <h1 className=' bg-slate-800 text-white px-8 py-3 rounded'>Manage Banner</h1>
                </div>
                <div className="px-6 pb-12">
                    <div className="overflow-x-auto  border">
                        <table className="table  lg:text-[16px] lg:table-lg table-xs overflow-x-auto">
                            {/* head */}
                            <thead>
                                <tr>
                                    <th>S/N</th>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Type</th>
                                    <th>Edit</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>

                                {bannerData?.map((book, i) => <tr key={i}>
                                    <th>
                                        <label>
                                            {i + 1}
                                        </label>
                                    </th>
                                    <td>
                                        <div className="flex items-center space-x-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-12 h-12">
                                                    <img src={book.image} alt={book.image} />
                                                </div>
                                            </div>

                                        </div>
                                    </td>
                                    <td>
                                        {book.name}
                                        <br />
                                        <span className="badge badge-ghost badge-sm">{book.author}</span>
                                    </td>
                                    <td>{book.category}</td>
                                    <td>{book.promo}</td>

                                    <td>
                                        <button className="btn btn-ghost">Edit</button>
                                    </td>
                                    <th>
                                        <button onClick={() => handleDeleteBook(book)} className="btn bg-red-600 text-white"> <AiFillDelete className='text-2xl' /></button>
                                    </th>
                                </tr>)}



                            </tbody>


                        </table>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ManageBanner;