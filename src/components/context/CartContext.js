import React, { createContext, useState, useCallback } from "react";
import blackSlant from "../images/shoes/29156443_fpx.webp";
import rosaSlant from "../images/shoes/26926238_fpx.webp";
import pinkSlant from "../images/shoes/29116166_fpx.webp";
import brownSlant from "../images/shoes/29519995_fpx.webp";
import axios from 'axios';

const BASE_URL = 'http://ecommerce.reworkstaging.name.ng/v2'; // Define the base URL

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [merchantId, setMerchantId] = useState(null); // Add state for merchant ID

    // Define products here
    const products = [
        {
            id: 1,
            name: "Nike Women's Pegasus 41 Running Sneakers from Finish Line",
            price: 140,
            imageUrl: blackSlant,
            rating: 4.5,
            reviews: 107,
            isNew: false,
        },
        {
            id: 2,
            name: "Women's Waffle Debut Casual Sneakers from Finish Line",
            price: 50,
            oldPrice: 75,
            imageUrl: rosaSlant,
            rating: 4.5,
            reviews: 88,
            isNew: false,
        },
        {
            id: 3,
            name: "Nike Women's V2K Run Running Sneakers from Finish Line",
            price: 105,
            oldPrice: 120,
            imageUrl: brownSlant,
            rating: 4.0,
            reviews: 50,
            isNew: true,
        },
        {
            id: 4,
            name: "Nike Women's React Infinity Run Flyknit 4 Running Sneakers from Finish Line",
            price: 160,
            imageUrl: pinkSlant,
            rating: 5.0,
            reviews: 80,
            isNew: false,
        }
    ];

    const fetchCartItems = useCallback(async () => {
        try {
            const userId = localStorage.getItem('userId');
            const response = await axios.get(`${BASE_URL}/carts?user_id=${userId}`);
            setCartItems(response.data);
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    }, []);

    const addToCart = async (productId, options) => {
        try {
            const userId = localStorage.getItem('userId');
            await axios.post(`${BASE_URL}/carts`, {
                user_id: userId,
                product_id: productId,
                ...options
            });
            fetchCartItems();
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const userId = localStorage.getItem('userId');
            await axios.delete(`${BASE_URL}/carts`, {
                data: { user_id: userId, product_id: productId }
            });
            fetchCartItems();
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    };

    const updateCartItemQuantity = async (productId, newQuantity) => {
        try {
            const userId = localStorage.getItem('userId');
            await axios.put(`${BASE_URL}/carts`, {
                user_id: userId,
                product_id: productId,
                quantity: newQuantity
            });
            fetchCartItems();
        } catch (error) {
            console.error('Error updating cart item quantity:', error);
        }
    };

    const values = {
        cartItems,
        merchantId,
        setMerchantId,
        fetchCartItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        products,
    };

    return (
        <CartContext.Provider value={values}>
            {children}
        </CartContext.Provider>
    );
};
