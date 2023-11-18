import { AiFillDelete } from "react-icons/ai";
import useBookData from "../../../hooks/useBookData";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManageBooks = () => {
    const [booksData, , refetch] = useBookData()
    const [axiosSecure] = useAxiosSecure()
    console.log(booksData)
    const handleDeleteBook = book => {
        console.log('selected bookd', book)
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            console.log(result)
            if (result.isConfirmed) {
                axiosSecure.delete(`/books/${book._id}`)
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
        <div className="w-full">
            <div className=" text-white text-2xl font-bold text-center mb-12 bg-[#081A51] py-12">
                Manage Books
            </div>
            <div className="px-6 pb-12">
                <div className="overflow-x-auto">
                    <table className="table table-pin-rows table-pin-cols">
                        {/* head */}
                        <thead>
                            <tr>
                                <th>S/N</th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Edit</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>

                            {booksData?.map((book, i) => <tr key={i}>
                                <th>
                                    <label>
                                        {i + 1}
                                    </label>
                                </th>
                                <td>
                                    <div className="flex items-center space-x-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-12 h-12">
                                                <img src={book.image} alt="Avatar Tailwind CSS Component" />
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
                                <td>{book.price}</td>
                                <td>
                                    <button className="btn btn-ghost btn-xs">Edit</button>
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
    );
};

export default ManageBooks;