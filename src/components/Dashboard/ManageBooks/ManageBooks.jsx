import useBookData from "../../../hooks/useBookData";

const ManageBooks = () => {
    const [booksData, , refetch] = useBookData()
    console.log(booksData)

    return (
        <div className="w-full">
            <div className=" text-white text-2xl font-bold text-center mb-12 bg-[#081A51] py-12">
                Manage Books
            </div>

            <div className="overflow-x-auto">
                <table className="table table-xs table-pin-rows table-pin-cols">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>S/N</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Chategory</th>
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
                                <span className="badge badge-ghost badge-sm">Author name</span>
                            </td>
                            <td>{book.category}</td>
                            <td>{book.price}</td>
                            <td>
                                <button className="btn btn-ghost btn-xs">Edit</button>
                            </td>
                            <td>
                                <button className="btn btn-primary btn-xs">Delete</button>
                            </td>
                        </tr>)}



                    </tbody>


                </table>
            </div>
        </div>
    );
};

export default ManageBooks;