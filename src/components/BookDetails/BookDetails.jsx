import { useNavigate, useParams } from "react-router-dom";
import useBookData from "../../hooks/useBookData";
import RelatedBooks from "../RelatedBooks/RelatedBooks";
import { CartContext } from "../../providers/CartProvider/CartProvider";
import { useContext } from "react";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";


const BookDetails = () => {
    const { id } = useParams()
    const { user } = useAuth()
    const [booksData] = useBookData()
    const { addToCart } = useContext(CartContext)
    const navigate = useNavigate()
    const [, refetch] = useCart()
    const productDetails = booksData.find(pd => pd.id == id)
    console.log(productDetails)
    if (!productDetails) {
        return <div className="container mx-auto">loading....</div>
    }

    const handleAddToCart = (item) => {
        const { category, name, image, price, _id } = item;
        const cartItem = { bookId: _id, category, name, image, price, email: user?.email }
        console.log('item', item)
        console.log(id)
        // phh -------
        if (user) {
            fetch('http://localhost:5000/carts', {
                method: "POST",
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(cartItem)
            })
                .then(res => res.json())
                .then(data => {
                    if (data.insertedId) {
                        refetch()
                        Swal.fire({
                            position: "top-end",
                            icon: "success",
                            title: "Add to the cart",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                })
        } else {
            Swal.fire({
                title: "Please Login",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Login now"
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login')

                }
            });


        }
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
                                onClick={() => handleAddToCart(productDetails)}
                                className="btn bg-blue-400 hover:bg-blue-200 transition-all">Add to cart
                            </button>
                            {/* <button
                                onClick={() => addToCart(productDetails, productDetails.id)}
                                className="btn bg-blue-400 hover:bg-blue-200 transition-all">Add to cart</button> */}
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