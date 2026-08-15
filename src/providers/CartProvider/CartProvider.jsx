import { createContext, useEffect, useState } from "react";

import useCart from "../../hooks/useCart";

// create context 
export const CartContext = createContext();

const CartProvider = ({ children }) => {

    const [isOpen, setIsOpen] = useState(false)


    return (
        <CartContext.Provider
            value={{
                isOpen,
                setIsOpen,

            }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;