import './BookDescription.css'
import { useParams } from "react-router-dom"
import useBookData from "../../hooks/useBookData";
// import GoogleAds from '../GoogleAds/GoogleAds';
// import AdSense from "react-adsense";

const BookDescription = () => {
    const { id } = useParams()
    const [booksData] = useBookData()
    const bookDescription = booksData?.find(pd => pd._id === id)
    return (
        <section className='px-[2vw] lg:px-0'>
            {/* description  */}
            <div className=" dark:text-gray-300 my-8 lg:my-8">
                <h3 className="text-xl font-medium my-2">Description</h3>
                <hr className="mb-4" />

                <p className="indent-8 whitespace-normal mb-5 text-sm md:text-md tracking-wide leading-6">{bookDescription?.description}</p>
            </div>

            {/* details  */}
            <div>
                <div className='py-4'>
                    <h1 className='text-xl font-semibold dark:text-gray-300 tracking-wide'>Book Details</h1>
                </div>



                <div className='lg:w-[60%] w-full'>

                    <table className="descriptionTable w-full ">

                        <tr >
                            <td className='border dark:border-slate-600 dark:text-gray-300'>Title</td>
                            <td className='border dark:border-slate-600 dark:text-gray-300'>{bookDescription.name}</td>

                        </tr>
                        <tr>
                            <td className='border dark:border-slate-600 dark:text-gray-300'>Author</td>
                            <td className='border dark:border-slate-600 dark:text-gray-300'>{bookDescription.author}</td>

                        </tr>
                        <tr>
                            <td className='border dark:border-slate-600 dark:text-gray-300 '>Language</td>
                            <td className='border dark:border-slate-600 dark:text-gray-300 capitalize'>{bookDescription.language}</td>
                        </tr>
                        <tr>
                            <td className='border dark:border-slate-600 dark:text-gray-300'>Publisher</td>
                            <td className='border dark:border-slate-600 dark:text-gray-300'>{bookDescription.publisher}</td>
                        </tr>
                        <tr>
                            <td className='border dark:border-slate-600 dark:text-gray-300'>
                                {
                                    bookDescription?.cover === 'hardcover' && <span className="text-[15px] "> Hardcover </span>
                                }
                                {
                                    bookDescription?.cover == 'paperback' && <span className="text-[15px] "> Paperback </span>
                                }
                                {
                                    bookDescription?.cover == 'leather bound' && <span className="text-[15px] "> Leather Bound </span>
                                }
                            </td>
                            <td className='border dark:border-slate-600 dark:text-gray-300'>{bookDescription.page} Pages</td>

                        </tr>
                        <tr>
                            <td className='border dark:border-slate-600 dark:text-gray-300'>ISBN-10</td>
                            <td className='border dark:border-slate-600 dark:text-gray-300'>{bookDescription.isbn10}</td>

                        </tr>
                        <tr>
                            <td className='border dark:border-slate-600 dark:text-gray-300'>ISBN-13</td>
                            <td className='border dark:border-slate-600 dark:text-gray-300'>{bookDescription.isbn13}</td>

                        </tr>

                        <tr>
                            <td className='border dark:border-slate-600 dark:text-gray-300'>Item Weight</td>
                            <td className='border dark:border-slate-600 dark:text-gray-300'>{bookDescription.itemWeight}</td>
                        </tr>
                        <tr>
                            <td className='border dark:border-slate-600 dark:text-gray-300'>Dimensions </td>
                            <td className='border dark:border-slate-600 dark:text-gray-300'>{bookDescription.dimensions}</td>

                        </tr>

                    </table>
                </div>
                {/* <div className='flex-1 hidden lg:block  relative'>
                        <div className=' w-[50%] h-full flex absolute right-0'>
                            <AdSense.Google
                                client='ca-pub-6281834095701895'
                                slot='8714813241'
                                style={{ display: "block" }}
                                layout="in-article"
                                format="fluid"
                            />
                        </div>
                    </div> */}
            </div>



        </section>
    )
}

export default BookDescription