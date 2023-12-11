import { useNavigate, useParams } from "react-router-dom";
import useBookData from "../../../hooks/useBookData";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../../hooks/useAxiosSecure";


const UpdateBook = () => {
    const { id } = useParams()
    const [booksData] = useBookData()
    const [axiosSecure] = useAxiosSecure()
    const productDetails = booksData.find(pd => pd._id == id)
    const { register, reset, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate()

    const onSubmit = data => {

        console.log(data)
        axiosSecure.put(`/books/${productDetails._id}`, data)
            .then(res => {
                if (res.data.modifiedCount > 0) {
                    alert('Book updated ')
                    console.log(res.data)
                    navigate('/dashboard/manageBooks')

                }
            }
            )
    }
    return (
        <div className=" container mx-auto ">
            <Helmet>
                <title>Book Ocean BD || Update book</title>
            </Helmet>
            <div className='pt-24 items-center  mb-8 flex flex-col'>
                <p className=' bg-slate-800 text-white px-8 py-3 rounded'>Update Book</p>
            </div>
            <div className='w-full flex items-center justify-center'>
                <div className="w-full lg:w-1/2 border dark:border-none dark:bg-slate-900 p-4 shadow-2xl rounded-[4px] text-black">
                    <form onSubmit={handleSubmit(onSubmit)} >
                        {/* name  */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-semibold ">Book name*</span>
                            </label>
                            <input type="text" placeholder="Type here" defaultValue={productDetails?.name} className="input input-bordered w-full bg-white"
                                {...register("name", { required: true })} />
                        </div>
                        {/* author  */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-semibold  ">Author name*</span>
                            </label>
                            <input type="text" placeholder="Type here" defaultValue={productDetails?.author} className="input input-bordered w-full bg-white"
                                {...register("author", { required: true })} />
                        </div>
                        {/* category  */}
                        <div className="flex gap-4 w-full">
                            <div className="form-control w-full ">
                                <label className="label">
                                    <span className="label-text font-semibold">Category*</span>

                                </label>
                                <select defaultValue={productDetails?.category} className="select select-bordered uppercase bg-white"  {...register("category", { required: true })}>
                                    <option disabled >Pick one</option>
                                    <option>Barnes & Noble</option>
                                    <option>Biography</option>
                                    <option>Children's</option>
                                    <option>Classic</option>
                                    <option>Comics</option>
                                    <option>Crime</option>
                                    <option>Deluxe Edition</option>
                                    <option>Fantasy</option>
                                    <option>Fiction</option>
                                    <option>Horror</option>
                                    <option>History</option>
                                    <option>Islamic</option>
                                    <option>Manga</option>
                                    <option>Mythology</option>
                                    <option>Non-Fiction</option>
                                    <option>Poetry</option>
                                    <option>Romance</option>
                                    <option>Science Fiction</option>
                                    <option>Thriller</option>
                                </select>

                            </div>
                            {/* price  */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold ">Price*</span>
                                </label>
                                <input type="number" placeholder="Type here" defaultValue={productDetails?.price} className="input input-bordered w-full bg-white"
                                    {...register("price", { required: true })} />
                            </div>
                        </div>
                        <div className='flex gap-4 w-full'>
                            {/* hardcover / paperback  */}
                            <div className="form-control w-full ">
                                <label className="label">
                                    <span className="label-text font-semibold">cover*</span>

                                </label>
                                <select defaultValue={productDetails?.cover} className="select select-bordered uppercase bg-white"  {...register("cover", { required: true })}>
                                    <option disabled >Pick one</option>
                                    <option value="hardcover">Hardcover</option>
                                    <option value="paperback">Paperback</option>
                                    <option value="leather bound">Leather Bound</option>
                                </select>

                            </div>
                            {/* available */}
                            <div className="form-control w-full ">
                                <label className="label">
                                    <span className="label-text font-semibold">Available*</span>

                                </label>
                                <select defaultValue={productDetails?.available} className="select select-bordered uppercase bg-white"  {...register("available", { required: true })}>
                                    <option disabled >Pick one</option>
                                    <option value="true">True</option>
                                    <option value="false">False</option>
                                </select>

                            </div>
                        </div>
                        {/* new best selling  */}
                        <div className='flex gap-4 w-full'>
                            {/* new*/}
                            <div className="form-control w-full ">
                                <label className="label">
                                    <span className="label-text font-semibold">New*</span>

                                </label>
                                <select defaultValue={productDetails?.new} className="select select-bordered uppercase bg-white"  {...register("new", { required: true })}>
                                    <option disabled >Pick one</option>
                                    <option value="true">True</option>
                                    <option value="false">False</option>
                                </select>

                            </div>
                            {/* best selling  */}
                            <div className="form-control w-full ">
                                <label className="label">
                                    <span className="label-text font-semibold">Best Selling*</span>

                                </label>
                                <select defaultValue={productDetails?.best} className="select select-bordered uppercase bg-white"  {...register("best", { required: true })}>
                                    <option disabled >Pick one</option>
                                    <option value="true">True</option>
                                    <option value="false">False</option>
                                </select>

                            </div>
                        </div>

                        <div className='mt-2'>

                        </div>
                        {/* details */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Description</span>

                            </label>
                            <textarea className="textarea textarea-bordered h-24 bg-white" defaultValue={productDetails?.description} placeholder="Description"
                                {...register("description", { required: true })}></textarea>

                        </div>
                        {/* fill upload  */}
                        {/* <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Item image</span>

                            </label>
                            <input type="file" className="file-input file-input-bordered w-full "
                                {...register("image", { required: true })} />

                        </div> */}
                        <input className=" bg-black w-full text-white mt-4 py-3 rounded hover:scale-105 duration-300 uppercase cursor-pointer hover:text-green-600" type="submit" value="Update Book" />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateBook;