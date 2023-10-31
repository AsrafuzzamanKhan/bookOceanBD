import { createContext, useEffect, useState } from "react";

// create context 
export const CartContext = createContext();

const CartProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [cart, setCart] = useState([])
    const [itemsAmount, setItemsAmount] = useState(0)
    const [amount, setAmount] = useState(0)
    const [total, setTotal] = useState(0)

    // cart amount 
    useEffect(() => {
        const amount = cart.reduce((a, c) => {
            return a + c.amount
        }, 0);
        setItemsAmount(amount)
    }, [cart])

    // cart total 
    useEffect(() => {
        const total = cart.reduce((a, c) => {
            return a + c.price * c.amount
        }, 0)
        setTotal(total)
    }, [cart])

    // add to cart 
    const addToCart = (item, id) => {

        const itemID = parseInt(id)

        const newItem = { ...item, amount: 1 }
        setCart([...cart, newItem])

        // check if item is already in cart 
        const cartItem = cart.find(item => item.id === itemID)
        if (cartItem) {
            const newCart = cart.map(item => {
                if (item.id === itemID) {
                    setAmount(cartItem.amount + 1)
                    return { ...item, amount: cartItem.amount + 1 }
                }
                else { return item }
            }
            );
            setCart(newCart)
        }
        else {
            setCart([...cart, newItem])
        }
        // open the cart 
        setIsOpen(true)

    }
    // console.log(cart)

    // remover from cart 
    const removerFromCart = (id) => {
        const newCart = cart.filter(pd => pd.id !== id)
        setCart(newCart)
        console.log(`item${id} removed`)
    }
    // handle input 
    const handleInput = (e, id) => {
        e.preventDefault()
        const value = parseInt(e.target.value)
        // find the uitem in the cart by id 
        const cartItem = cart.find(item => item.id === id)

        if (cartItem) {
            const newCart = cart.map(item => {
                if (item.id === id) {
                    if (isNaN(value)) {
                        setAmount(1)
                        return { ...item, amount: 1 }
                    } else {
                        setAmount(value)
                        return { ...item, amount: value }
                    }
                } else {
                    return item
                }
            });
            setCart(newCart)
        }
        setIsOpen(true)
        // console.log('cart id', cartItem);
    }
    // handle selected 
    const handleSelect = (e, id) => {
        const value = parseInt(e.target.value);
        const cartItem = cart.find(item => item.id === id)
        if (cartItem) {
            const newCart = [...cart].map(item => {
                if (item.id === id) {
                    setAmount(value);
                    return { ...item, amount: value }
                } else {
                    return item;
                }
            });
            setCart(newCart)
        }
    }
    // clear cart 

    const clearCart = () => {
        setCart([])
    }


    return (
        <CartContext.Provider
            value={{
                isOpen,
                setIsOpen,
                addToCart,
                cart,
                removerFromCart,
                itemsAmount,
                handleInput,
                handleSelect,
                total,
                clearCart
            }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;