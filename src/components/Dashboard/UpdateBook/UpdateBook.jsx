import { useNavigate, useParams } from "react-router-dom";
import useBookData from "../../../hooks/useBookData";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useState } from "react";
import { resizeImageFile, uploadToImgbb } from "../../../utils/imgbb";
import { showSuccessToast, showErrorToast } from "../../../utils/toast";

// same cap as AddBooks.jsx - see comment there
const FULL_IMAGE_MAX_DIMENSION = 1200;

const UpdateBook = () => {
    const [updateLoading, setupdateLoadin] = useState(false)
    const { id } = useParams()
    const [booksData] = useBookData()
    const [axiosSecure] = useAxiosSecure()
    const productDetails = booksData.find(pd => pd._id == id);

    const { register, handleSubmit } = useForm();
    const navigate = useNavigate()

    const onSubmit = async data => {
        console.log('update book data', data);
        setupdateLoadin(true)

        try {
            const { name, price, category, description, publisher, language, page, isbn10, isbn13, itemWeight, dimensions, author, quantity, best, cover, new: newBook, image } = data;
            const stockCount = parseInt(quantity, 10) || 0;
            // available is derived from quantity - no stock means unavailable,
            // regardless of what was typed here
            const updateBookItem = { name, price: parseFloat(price), category, description, publisher, language, page, isbn10, isbn13, itemWeight, dimensions, author, quantity: stockCount, available: stockCount > 0 ? 'true' : 'false', best, cover, newBook }

            // image is optional here - only upload/replace it if a new file
            // was actually picked, otherwise the book keeps its current cover
            const file = image?.[0];
            if (file) {
                const [fullBlob, thumbBlob] = await Promise.all([
                    resizeImageFile(file, FULL_IMAGE_MAX_DIMENSION),
                    resizeImageFile(file),
                ]);
                const [fullRes, thumbRes] = await Promise.all([
                    uploadToImgbb(fullBlob),
                    uploadToImgbb(thumbBlob),
                ]);
                if (!fullRes.success) throw new Error('Cover image upload failed');
                updateBookItem.image = fullRes.data.display_url;
                updateBookItem.thumbnail = thumbRes.success ? thumbRes.data.display_url : updateBookItem.image;
            }

            const res = await axiosSecure.put(`/books/${productDetails._id}`, updateBookItem)
            if (res.data.modifiedCount > 0) {
                showSuccessToast('Book updated!')
                navigate('/dashboard/manageBooks')
            }
        } catch (err) {
            console.error(err);
            showErrorToast('Failed to update book', err.message)
        } finally {
            setupdateLoadin(false)
        }
    };
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
                                <select
                                    defaultValue={productDetails?.category}
                                    className="select select-bordered capitalize  bg-white"  {...register("category", { required: true })}>
                                    <option disabled >Pick one</option>
                                    <option value='barnes & noble'>barnes & noble</option>
                                    <option value='biography'>biography</option>
                                    <option value="children's">children's</option>
                                    <option value='classics'>classics</option>
                                    <option value='comics'>comics</option>
                                    <option value='crime'>crime</option>
                                    <option value='deluxe edition'>deluxe edition</option>
                                    <option value='fantasy'>fantasy</option>
                                    <option value='fiction'>fiction</option>
                                    <option value='horror'>horror</option>
                                    <option value='history'>history</option>
                                    <option value='islamic'>islamic</option>
                                    <option value='manga'>manga</option>
                                    <option value='mythology'>mythology</option>
                                    <option value='non-fiction'>non-fiction</option>
                                    <option value='poetry'>poetry</option>
                                    <option value='romance'>romance</option>
                                    <option value='science fiction'>science fiction</option>
                                    <option value='thriller'>thriller</option>
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
                                <select defaultValue={productDetails?.cover} className="select select-bordered capitalize bg-white text-black"  {...register("cover", { required: true })}>
                                    <option disabled >Pick one</option>
                                    <option value="hardcover">Hardcover</option>
                                    <option value="paperback">Paperback</option>
                                    <option value="leather bound">Leather Bound</option>
                                </select>

                            </div>
                            {/* quantity - stock count; available is derived from this */}
                            <div className="form-control w-full ">
                                <label className="label">
                                    <span className="label-text font-semibold">Quantity*</span>
                                </label>
                                <input type="number" min="0" defaultValue={productDetails?.quantity ?? 0} placeholder="0" className="input input-bordered w-full bg-white"
                                    {...register("quantity", { required: true, min: 0 })} />
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


                        {/* details  */}
                        <div className='grid grid-cols-2 gap-4'>
                            {/* Description */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Description</span>

                                </label>
                                <textarea defaultValue={productDetails?.description} className="textarea textarea-bordered h-24 bg-white text-black" placeholder="Description"
                                    {...register("description", { required: true })}></textarea>

                            </div>
                            {/* Publisher  */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold ">Publisher*</span>
                                </label>
                                <input defaultValue={productDetails?.publisher} type="text" placeholder="Type here" className="input input-bordered w-full bg-white text-black "
                                    {...register("publisher", { required: true })} />
                            </div>
                            {/* Language  */}
                            <div className="form-control w-full ">
                                <label className="label">
                                    <span className="label-text font-semibold">Language*</span>

                                </label>
                                <select defaultValue={productDetails?.language} className="select select-bordered uppercase bg-white text-black"  {...register("language", { required: true })}>
                                    <option disabled >Pick one</option>
                                    <option>english</option>
                                    <option>bangla</option>
                                </select>

                            </div>
                            {/* page  */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold ">Page*</span>
                                </label>
                                <input defaultValue={productDetails?.page} type="number" placeholder="Type here" className="input input-bordered w-full bg-white text-black "
                                    {...register("page", { required: true })} />
                            </div>
                            {/* ISBN-10  */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold ">ISBN-10*</span>
                                </label>
                                <input defaultValue={productDetails?.isbn10} type="text" placeholder="Type here" className="input input-bordered w-full bg-white text-black "
                                    {...register("isbn10", { required: true })} />
                            </div>
                            {/* isbn-13  */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold ">ISBN-13*</span>
                                </label>
                                <input defaultValue={productDetails?.isbn13} type="text" placeholder="Type here" className="input input-bordered w-full bg-white text-black "
                                    {...register("isbn13", { required: true })} />
                            </div>
                            {/* Item Weight  */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold ">Item Weight*</span>
                                </label>
                                <input defaultValue={productDetails?.itemWeight} type="text" placeholder="Type here" className="input input-bordered w-full bg-white text-black "
                                    {...register("itemWeight", { required: true })} />
                            </div>
                            {/* Dimensions   */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold ">Dimensions*</span>
                                </label>
                                <input defaultValue={productDetails?.dimensions} type="text" placeholder="Type here" className="input input-bordered w-full bg-white text-black "
                                    {...register("dimensions", { required: true })} />
                            </div>
                        </div>

                        {/* cover image - optional, keeps the existing cover if left empty */}
                        <div className="form-control w-full mt-4">
                            <label className="label">
                                <span className="label-text font-semibold">Cover image</span>
                            </label>
                            <div className="flex items-center gap-4">
                                {productDetails?.image && (
                                    <img
                                        src={productDetails.image}
                                        alt={productDetails?.name}
                                        className="w-16 h-20 object-cover rounded border"
                                    />
                                )}
                                <input type="file" accept="image/*" className="file-input file-input-bordered w-full bg-white text-black"
                                    {...register("image")} />
                            </div>
                            <span className="label-text-alt text-gray-500 mt-1">
                                Leave empty to keep the current cover shown above.
                            </span>
                        </div>

                        <div>
                            {
                                updateLoading ? <div className="text-center">
                                    <span className="loading loading-ball loading-xs"></span>
                                    <span className="loading loading-ball loading-sm"></span>
                                    <span className="loading loading-ball loading-md"></span>
                                    <span className="loading loading-ball loading-lg"></span></div>
                                    : <> <input className=" bg-black w-full text-white mt-4 py-3 rounded duration-300 uppercase cursor-pointer hover:bg-slate-800" type="submit" value="Update Book" /></>
                            }
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateBook;