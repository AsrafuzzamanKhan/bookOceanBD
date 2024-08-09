
import { useForm } from 'react-hook-form';
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { Helmet } from 'react-helmet-async';
const img_hosting_token = import.meta.env.VITE_image_Upload_token;

const AddBooks = () => {
    const [axiosSecure] = useAxiosSecure()
    const { register, reset, handleSubmit } = useForm();

    const img_hosting_url = `https://api.imgbb.com/1/upload?key=${img_hosting_token}`

    console.log(img_hosting_url);

    const onSubmit = data => {
        console.log('add book data', data);

        const formData = new FormData();
        formData.append('image', data.image[0]);

        fetch(img_hosting_url, {
            method: "POST",
            body: formData
        })
            .then(res => res.json())
            .then(imgResponse => {
                if (imgResponse.success) {
                    const imaURL = imgResponse.data.display_url;
                    const { name, price, category, description, publisher, language, page, isbn10, isbn13, itemWeight, dimensions, author, available, best, cover, new: newBook } = data;
                    const newBookItem = { name, price: parseFloat(price), category, description, publisher, language, page, isbn10, isbn13, itemWeight, dimensions, image: imaURL, author, available, best, cover, newBook }
                    console.log(newBookItem)
                    axiosSecure.post('/books', newBookItem)
                        .then(data => {
                            console.log('Post in database', data);
                            if (data.data.insertedId) {
                                reset()
                                Swal.fire({
                                    position: 'top-end',
                                    icon: 'success',
                                    title: 'Book is added successfully!!!',
                                    showConfirmButton: false,
                                    timer: 1500
                                })
                            }
                        })
                }
            })

    };
    // console.log(errors);
    console.log(img_hosting_token)
    return (
        <div className=" container mx-auto">
            <Helmet>
                <title>Book Ocean BD || Add book</title>
            </Helmet>
            <div className="mb-[30px] pt-28 md:pt-28 lg:pt-0 xl:pt-24 min-h-screen">
                <div className=' items-center  mb-8 flex flex-col'>
                    <h1 className=' bg-slate-800 text-white px-8 py-3 rounded'>Add Book</h1>
                </div>
                <div className='w-full flex items-center justify-center'>
                    <div className=" w-full lg:w-1/2 border p-4 shadow-2xl rounded-[8px] dark:text-white dark:border-0">
                        <form onSubmit={handleSubmit(onSubmit)} >
                            {/* name  */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold ">Book name*</span>
                                </label>
                                <input type="text" placeholder="Type here" className="input input-bordered w-full dark:text-white "
                                    {...register("name", { required: true })} />
                            </div>
                            {/* author  */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold ">Author name*</span>
                                </label>
                                <input type="text" placeholder="Type here" className="input input-bordered w-full dark:text-white "
                                    {...register("author", { required: true })} />
                            </div>
                            {/* category  */}
                            <div className="flex gap-4 w-full">
                                <div className="form-control w-full ">
                                    <label className="label">
                                        <span className="label-text font-semibold">Category*</span>

                                    </label>
                                    <select defaultValue='Pick one' className="select select-bordered capitalize "  {...register("category", { required: true })}>
                                        <option disabled >Pick one</option>
                                        <option>barnes & noble</option>
                                        <option>biography</option>
                                        <option>children</option>
                                        <option>classics</option>
                                        <option>comics</option>
                                        <option>crime</option>
                                        <option>deluxe edition</option>
                                        <option>fantasy</option>
                                        <option>fiction</option>
                                        <option>horror</option>
                                        <option>history</option>
                                        <option>islamic</option>
                                        <option>manga</option>
                                        <option>mythology</option>
                                        <option>non-fiction</option>
                                        <option>poetry</option>
                                        <option>romance</option>
                                        <option>science fiction</option>
                                        <option>thriller</option>
                                    </select>

                                </div>
                                {/* price  */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-semibold ">Price*</span>
                                    </label>
                                    <input type="number" placeholder="Type here" className="input input-bordered w-full dark:text-white "
                                        {...register("price", { required: true })} />
                                </div>
                            </div>
                            <div className='flex gap-4 w-full'>
                                {/* hardcover / paperback  */}
                                <div className="form-control w-full ">
                                    <label className="label">
                                        <span className="label-text font-semibold">cover*</span>

                                    </label>
                                    <select defaultValue='Pick one' className="select select-bordered capitalize"  {...register("cover", { required: true })}>
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
                                    <select defaultValue='Pick one' className="select select-bordered uppercase"  {...register("available", { required: true })}>
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
                                    <select defaultValue='Pick one' className="select select-bordered uppercase"  {...register("new", { required: true })}>
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
                                    <select defaultValue='Pick one' className="select select-bordered uppercase"  {...register("best", { required: true })}>
                                        <option disabled >Pick one</option>
                                        <option value="true">True</option>
                                        <option value="false">False</option>
                                    </select>

                                </div>
                            </div>

                            <div className='mt-2'>

                            </div>

                            {/* details  */}
                            <div className='grid grid-cols-2 gap-4'>
                                {/* Description */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Description</span>

                                    </label>
                                    <textarea className="textarea textarea-bordered h-24" placeholder="Description"
                                        {...register("description", { required: true })}></textarea>

                                </div>
                                {/* Publisher  */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-semibold ">Publisher*</span>
                                    </label>
                                    <input type="text" placeholder="Type here" className="input input-bordered w-full dark:text-white "
                                        {...register("publisher", { required: true })} />
                                </div>
                                {/* Language  */}
                                <div className="form-control w-full ">
                                    <label className="label">
                                        <span className="label-text font-semibold">Language*</span>

                                    </label>
                                    <select defaultValue='Pick one' className="select select-bordered uppercase"  {...register("language", { required: true })}>
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
                                    <input type="number" placeholder="Type here" className="input input-bordered w-full dark:text-white "
                                        {...register("page", { required: true })} />
                                </div>
                                {/* ISBN-10  */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-semibold ">ISBN-10*</span>
                                    </label>
                                    <input type="text" placeholder="Type here" className="input input-bordered w-full dark:text-white "
                                        {...register("isbn10", { required: true })} />
                                </div>
                                {/* isbn-13  */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-semibold ">ISBN-13*</span>
                                    </label>
                                    <input type="text" placeholder="Type here" className="input input-bordered w-full dark:text-white "
                                        {...register("isbn13", { required: true })} />
                                </div>
                                {/* Item Weight  */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-semibold ">Item Weight*</span>
                                    </label>
                                    <input type="text" placeholder="Type here" className="input input-bordered w-full dark:text-white "
                                        {...register("itemWeight", { required: true })} />
                                </div>
                                {/* Dimensions   */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-semibold ">Dimensions*</span>
                                    </label>
                                    <input type="text" placeholder="Type here" className="input input-bordered w-full dark:text-white "
                                        {...register("dimensions", { required: true })} />
                                </div>
                            </div>


                            {/* fill upload  */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Item image</span>

                                </label>
                                <input type="file" className="file-input file-input-bordered w-full "
                                    {...register("image", { required: true })} />

                            </div>
                            {/* submit button  */}
                            <input className=" bg-black w-full text-white mt-4 py-3 rounded hover:scale-105 duration-300 uppercase cursor-pointer hover:text-green-600" type="submit" value="Add Item" />
                        </form>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default AddBooks;