import { useForm } from 'react-hook-form';
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { showSuccessToast, showErrorToast } from "../../../utils/toast";
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { resizeImageFile, uploadToCloudinary } from '../../../utils/image';

const AddBanner = () => {
    const [axiosSecure] = useAxiosSecure()
    const [addLoading, setAddLoading] = useState(false)
    const { register, reset, handleSubmit } = useForm();

    // Banners were previously uploaded as-is (raw admin-exported PNGs, 74-131KB
    // each, no resizing) and shown eagerly on the homepage hero - directly
    // slowing down the first thing visitors see. Resize to 800px (comfortably
    // covers the largest display size - the hero slider at lg:w-96 - with
    // headroom for retina screens) and re-encode as JPEG before upload.
    const BANNER_MAX_DIMENSION = 800;

    const onSubmit = async data => {
        setAddLoading(true)
        try {
            const file = data.image[0];
            const resized = await resizeImageFile(file, BANNER_MAX_DIMENSION);
            const imgResponse = await uploadToCloudinary(resized);
            if (!imgResponse.success) throw new Error('Banner image upload failed');

            const imaURL = imgResponse.data.display_url;
            const { name, discount, author, category, promo } = data;
            const newBannerItem = { name, category, image: imaURL, author, discount, promo }
            const res = await axiosSecure.post('/banners', newBannerItem)
            if (res.data.insertedId) {
                reset()
                showSuccessToast('Banner is added successfully!!!')
            }
        } catch (err) {
            console.error(err);
            showErrorToast('Failed to add banner', err.message)
        } finally {
            setAddLoading(false)
        }
    };
    return (
        <div className=" container mx-auto">
            <Helmet>
                <title>Book Ocean BD || Add Banner</title>
            </Helmet>
            <div className="mb-[30px] pt-28 md:pt-28 lg:pt-0 xl:pt-24 min-h-screen">
                <div className=' items-center  mb-8 flex flex-col'>
                    <h1 className=' bg-slate-800 text-white px-8 py-3 rounded'>Add Banner</h1>
                </div>
                <div className='w-full flex items-center justify-center'>
                    <div className=" w-full lg:w-1/2 border p-4 shadow-2xl rounded-[8px] dark:text-white dark:border-0   ">
                        <form onSubmit={handleSubmit(onSubmit)} >
                            {/* name  */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold ">Book name*</span>
                                </label>
                                <input type="text" placeholder="Type here" className="input input-bordered w-full"
                                    {...register("name", { required: true })} />
                            </div>
                            {/* author  */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold ">Author name*</span>
                                </label>
                                <input type="text" placeholder="Type here" className="input input-bordered w-full"
                                    {...register("author", { required: true })} />
                            </div>


                            {/* discount */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold ">Discount</span>
                                </label>
                                <input type="number" placeholder="Discount" className="input input-bordered w-full"
                                    {...register("discount", { required: true })} />
                            </div>
                            {/*hero/promo */}
                            <div className="form-control w-full ">
                                <label className="label">
                                    <span className="label-text font-semibold">Type*</span>

                                </label>
                                <select defaultValue='Pick one' className="select select-bordered uppercase"  {...register("promo", { required: true })}>
                                    <option disabled >Pick one</option>
                                    <option value="hero">Hero</option>
                                    <option value="promo">promo</option>
                                </select>

                            </div>
                            {/* category  */}
                            <div className="flex gap-4 w-full">
                                <div className="form-control w-full ">
                                    <label className="label">
                                        <span className="label-text font-semibold">Category*</span>

                                    </label>
                                    <select defaultValue='Pick one' className="select select-bordered uppercase"  {...register("category", { required: true })}>
                                        <option disabled >Pick one</option>
                                        <option>Fantasy</option>
                                        <option>Horror</option>
                                        <option>Romance</option>
                                        <option>Fiction</option>
                                        <option>Comics</option>
                                        <option>Manga</option>
                                        <option>Islamic</option>
                                        <option>Mythology</option>
                                        <option>Non-Fiction</option>
                                        <option>Crime</option>
                                        <option>Classic</option>
                                    </select>

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
                            {
                                addLoading ? <div className='text-center mt-1'>
                                    <span className="loading loading-ball loading-xs"></span>
                                    <span className="loading loading-ball loading-sm"></span>
                                    <span className="loading loading-ball loading-md"></span>
                                    <span className="loading loading-ball loading-lg"></span></div>
                                    : <input className=" bg-black w-full text-white mt-4 py-3 rounded hover:scale-105 duration-300 uppercase cursor-pointer hover:text-green-600" type="submit" value="Add Item" />
                            }
                        </form>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default AddBanner;