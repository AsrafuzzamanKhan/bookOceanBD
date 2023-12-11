import { useForm } from 'react-hook-form';
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { Helmet } from 'react-helmet-async';
const img_hosting_token = import.meta.env.VITE_image_Upload_token;
const AddBanner = () => {
    const [axiosSecure] = useAxiosSecure()
    const { register, reset, handleSubmit, formState: { errors } } = useForm();
    const img_hosting_url = `https://api.imgbb.com/1/upload?key=${img_hosting_token}`
    console.log(img_hosting_url);


    const onSubmit = data => {
        console.log('add banner data', data)
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
                    const { name, discount, author, category, promo } = data;
                    const newBannerItem = { name, category, image: imaURL, author, discount, promo }
                    console.log(newBannerItem)
                    axiosSecure.post('/banners', newBannerItem)
                        .then(data => {
                            console.log('Post in database', data);
                            if (data.data.insertedId) {
                                reset()
                                Swal.fire({
                                    position: 'top-end',
                                    icon: 'success',
                                    title: 'Banner is added successfully!!!',
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
                <title>Book Ocean BD || Add Banner</title>
            </Helmet>
            <div className='pt-24 items-center  mb-8 flex flex-col'>
                <p className=' bg-slate-800 text-white px-8 py-3 rounded'>Add Banner</p>
            </div>
            <div className='w-full flex items-center justify-center'>
                <div className=" w-full lg:w-1/2 border p-4 shadow-2xl rounded-[8px] ">
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
                        <input className=" bg-black w-full text-white mt-4 py-3 rounded hover:scale-105 duration-300 uppercase cursor-pointer hover:text-green-600" type="submit" value="Add Item" />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddBanner;