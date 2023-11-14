
import { useForm } from 'react-hook-form';
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
const img_hosting_token = import.meta.env.VITE_image_Upload_token;

const AddBooks = () => {
    const [axiosSecure] = useAxiosSecure()
    const { register, reset, handleSubmit, formState: { errors } } = useForm();
    const img_hosting_url = `https://api.imgbb.com/1/upload?key=${img_hosting_token}`
    console.log(img_hosting_url);
    const onSubmit = data => {
        const formData = new FormData();
        formData.append('image', data.image[0]);

        fetch(img_hosting_url, {
            method: "POST",
            body: formData
        })
            .then(res => res.json())
            .then(imgResponse => {
                if (imgResponse.success) {
                    reset()
                    const imaURL = imgResponse.data.display_url;
                    const { name, price, category, recipe } = data;
                    const newMenuItem = { name, price: parseFloat(price), category, recipe, image: imaURL }
                    console.log(newMenuItem)
                    axiosSecure.post('/books', newMenuItem)
                        .then(data => {
                            console.log('Post in database', data);
                            if (data.data.insertedId) {
                                Swal.fire({
                                    position: 'top-end',
                                    icon: 'success',
                                    title: 'Menu added successfully!!!',
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
        <div className=" w-full flex flex-col ">
            <div>
                <h1 className="text-2xl">Add books</h1>
            </div>
            <div className="border w-full p-12  flex items-center justify-center">
                <form onSubmit={handleSubmit(onSubmit)} >
                    {/* name  */}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold ">Recipe name*</span>
                        </label>
                        <input type="text" placeholder="Type here" className="input input-bordered w-full"
                            {...register("name", { required: true })} />
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
                                <option>Romantic</option>
                                <option>Fiction</option>
                                <option>Comics</option>
                                <option>Islamic</option>
                                <option>Mythology</option>
                                <option>Non-Fiction</option>
                                <option>Crime</option>
                            </select>

                        </div>
                        {/* price  */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-semibold ">Price*</span>
                            </label>
                            <input type="number" placeholder="Type here" className="input input-bordered w-full"
                                {...register("price", { required: true })} />
                        </div>
                    </div>
                    {/* details */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Recipe</span>

                        </label>
                        <textarea className="textarea textarea-bordered h-24" placeholder="Recipe"
                            {...register("recipe", { required: true })}></textarea>

                    </div>
                    {/* fill upload  */}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Item image</span>

                        </label>
                        <input type="file" className="file-input file-input-bordered w-full "
                            {...register("image", { required: true })} />

                    </div>
                    <input className="btn btn-sm mt-4" type="submit" value="Add Item" />
                </form>
            </div>
        </div>

    );
};

export default AddBooks;