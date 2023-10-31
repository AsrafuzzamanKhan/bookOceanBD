import { useParams } from "react-router-dom";
import useBookData from "../../hooks/useBookData";
import RelatedBooks from "../RelatedBooks/RelatedBooks";
import { CartContext } from "../../providers/CartProvider/CartProvider";
import { useContext } from "react";


const BookDetails = () => {
    const { id } = useParams()
    const [booksData] = useBookData()
    const { addToCart } = useContext(CartContext)
    const productDetails = booksData.find(pd => pd.id == id)
    console.log(productDetails)
    if (!productDetails) {
        return <div className="container mx-auto">loading....</div>
    }
    return (
        <div className="mb-16 pt-44 lg:pt-[30px] xl:pt-36">
            <div className="container mx-auto px-2">
                {/* text  */}
                <div className="flex flex-col lg:flex-row gap-[30px] mb-[30px]">
                    <div className="flex-1 lg:max-w-[40%] lg:h-[550px] border shadow-2xl rounded-lg flex justify-center items-center">
                        <img src={productDetails.image}
                            className=" max-w-[65%] max-h-96 p-4"
                            alt="image" />
                    </div>
                    <div className="flex-1 p-12 xl:p-20 flex flex-col justify-center border">
                        {/* category  */}
                        <div className="uppercase text-blue-400 text-lg font-medium mb-2"> {productDetails.category}  </div>
                        {/* title  */}
                        <h2 className="h2 mb-4"> {productDetails.name} Book </h2>
                        {/* description  */}
                        <p className="mb-5">{productDetails.description}</p>
                        <div className="mb-12">
                            {
                                productDetails.isHardcover == true && <span className="text-[15px] "> Hardcover </span>
                            }
                            {
                                productDetails.isPaperback == true && <span className="text-[15px] "> Paperback </span>
                            }
                        </div>
                        {/* price and btn   */}
                        <div className="flex items-center gap-x-8">
                            {/* price  */}
                            <div className="text-3xl font-semibold text-blue-400">$ {productDetails.price}</div>

                            <button
                                onClick={() => addToCart(productDetails, productDetails.id)}
                                className="btn bg-blue-400 hover:bg-blue-200 transition-all">Add to cart</button>
                        </div>

                    </div>
                </div>
                {/* relatged  product  */}
                <RelatedBooks
                    categoryTitle={productDetails.category}
                ></RelatedBooks>
            </div>
        </div>
    );
};

export default BookDetails;