import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useState } from "react";
import { resizeImageFile, uploadToCloudinary } from "../../../utils/image";
import { showSuccessToast, showErrorToast } from "../../../utils/toast";
import Loading from "../../../Loading/Loading";

// same cap as AddBooks.jsx - see comment there
const FULL_IMAGE_MAX_DIMENSION = 1200;

// human-readable names for the fields still marked required, for the error
// summary below - only the fields that stayed required after the fix need
// an entry; anything else falls back to its raw register() name
const FIELD_LABELS = {
    name: 'Book name',
    author: 'Author name',
    category: 'Category',
    price: 'Price',
    cover: 'Cover',
    quantity: 'Quantity',
    new: 'New',
    best: 'Best Selling',
};

const UpdateBook = () => {
    const [updateLoading, setupdateLoadin] = useState(false)
    const { id } = useParams()
    const [axiosSecure] = useAxiosSecure()
    // Fetched by id directly (full document, description included) rather
    // than filtered out of the shared all-books list - that list deliberately
    // excludes description now (see GET /books on the server), so this page
    // (the only admin page that edits it) fetches the single full record itself.
    const { data: productDetails, isLoading: productLoading } = useQuery({
        queryKey: ['book', id],
        queryFn: async () => {
            const res = await fetch(`https://book-ocean-bd-server.vercel.app/books/${id}`)
            if (!res.ok) return null
            return res.json()
        },
        enabled: !!id,
    })

    // formState.errors is read below so a failed validation is actually
    // visible - previously handleSubmit(onSubmit) had no onInvalid handler,
    // so react-hook-form would silently do nothing on submit whenever any
    // required field was empty, with zero feedback. That was hitting most
    // real edits: books created by the Google Sheet sync are deliberately
    // saved with blank description/page/isbn10/etc for later manual
    // completion (~40% of the catalog at last count), and every one of
    // those fields was marked required here - so trying to edit even just
    // the price on one of those books would silently fail unless every
    // other blank field got filled in first.
    const { register, handleSubmit, formState: { errors } } = useForm();
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
                    uploadToCloudinary(fullBlob),
                    uploadToCloudinary(thumbBlob),
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

    // must not render the form (all its inputs use uncontrolled
    // defaultValue) until productDetails has actually arrived - an
    // uncontrolled input only takes its defaultValue on first mount, so
    // mounting the form early with productDetails still undefined would
    // leave every field permanently blank even after the real data loads
    if (productLoading || !productDetails) {
        return <Loading />;
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
                <div className="w-full lg:w-1/2 border dark:border-none dark:bg-slate-900 p-4 shadow-2xl rounded-[4px] text-black dark:text-white">
                    <form onSubmit={handleSubmit(onSubmit)} >
                        {/* name  */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-semibold ">Book name*</span>
                            </label>
                            <input type="text" placeholder="Type here" defaultValue={productDetails?.name} className="input input-bordered w-full"
                                {...register("name", { required: true })} />
                        </div>
                        {/* author  */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-semibold  ">Author name*</span>
                            </label>
                            <input type="text" placeholder="Type here" defaultValue={productDetails?.author} className="input input-bordered w-full"
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
                                    className="select select-bordered capitalize"  {...register("category", { required: true })}>
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
                                <input type="number" placeholder="Type here" defaultValue={productDetails?.price} className="input input-bordered w-full"
                                    {...register("price", { required: true })} />
                            </div>
                        </div>
                        <div className='flex gap-4 w-full'>
                            {/* hardcover / paperback  */}
                            <div className="form-control w-full ">
                                <label className="label">
                                    <span className="label-text font-semibold">cover*</span>

                                </label>
                                <select defaultValue={productDetails?.cover} className="select select-bordered capitalize"  {...register("cover", { required: true })}>
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
                                <input type="number" min="0" defaultValue={productDetails?.quantity ?? 0} placeholder="0" className="input input-bordered w-full"
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
                                {/* DB field is "newBook" (see GET /books' projection / the sync's
                                    newBookDoc) - this used to read productDetails?.new, which is
                                    always undefined, so the dropdown never matched the book's real
                                    value and instead defaulted to the disabled placeholder. Since
                                    that placeholder still has a truthy value ("Pick one" - no value
                                    attribute means its value falls back to its text), react-hook-form's
                                    required check silently accepted it, and every edit that didn't
                                    explicitly re-pick True/False overwrote newBook with the literal
                                    string "Pick one" instead of preserving it. */}
                                <select defaultValue={productDetails?.newBook} className="select select-bordered uppercase"  {...register("new", { required: true })}>
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
                                <select defaultValue={productDetails?.best} className="select select-bordered uppercase"  {...register("best", { required: true })}>
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
                                <textarea defaultValue={productDetails?.description} className="textarea textarea-bordered h-24" placeholder="Description"
                                    {...register("description")}></textarea>

                            </div>
                            {/* Publisher  */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold ">Publisher</span>
                                </label>
                                <input defaultValue={productDetails?.publisher} type="text" placeholder="Type here" className="input input-bordered w-full"
                                    {...register("publisher")} />
                            </div>
                            {/* Language  */}
                            <div className="form-control w-full ">
                                <label className="label">
                                    <span className="label-text font-semibold">Language</span>

                                </label>
                                <select defaultValue={productDetails?.language} className="select select-bordered uppercase"  {...register("language")}>
                                    <option value="">Pick one</option>
                                    <option>english</option>
                                    <option>bangla</option>
                                </select>

                            </div>
                            {/* page  */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold ">Page</span>
                                </label>
                                <input defaultValue={productDetails?.page} type="number" placeholder="Type here" className="input input-bordered w-full"
                                    {...register("page")} />
                            </div>
                            {/* ISBN-10  */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold ">ISBN-10</span>
                                </label>
                                <input defaultValue={productDetails?.isbn10} type="text" placeholder="Type here" className="input input-bordered w-full"
                                    {...register("isbn10")} />
                            </div>
                            {/* isbn-13  */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold ">ISBN-13</span>
                                </label>
                                <input defaultValue={productDetails?.isbn13} type="text" placeholder="Type here" className="input input-bordered w-full"
                                    {...register("isbn13")} />
                            </div>
                            {/* Item Weight  */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold ">Item Weight</span>
                                </label>
                                <input defaultValue={productDetails?.itemWeight} type="text" placeholder="Type here" className="input input-bordered w-full"
                                    {...register("itemWeight")} />
                            </div>
                            {/* Dimensions   */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold ">Dimensions</span>
                                </label>
                                <input defaultValue={productDetails?.dimensions} type="text" placeholder="Type here" className="input input-bordered w-full"
                                    {...register("dimensions")} />
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
                                <input type="file" accept="image/*" className="file-input file-input-bordered w-full"
                                    {...register("image")} />
                            </div>
                            <span className="label-text-alt text-gray-500 mt-1">
                                Leave empty to keep the current cover shown above.
                            </span>
                        </div>

                        {/* react-hook-form silently skips onSubmit when validation fails
                            and there's no onInvalid handler - this is the only feedback
                            the admin gets when the required fields above (name, author,
                            category, price, cover, quantity, new, best) are missing */}
                        {Object.keys(errors).length > 0 && (
                            <div className="mt-4 rounded border border-red-300 bg-red-50 dark:bg-red-950 dark:border-red-800 text-red-700 dark:text-red-300 text-sm px-4 py-3">
                                Please fill in: {Object.keys(errors).map(field => FIELD_LABELS[field] || field).join(', ')}
                            </div>
                        )}

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