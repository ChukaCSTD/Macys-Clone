import { createContext, useState, useCallback } from 'react';
import axios from 'axios';

const BASE_URL = 'http://ecommerce.reworkstaging.name.ng/v2';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);

  const fetchCartItems = useCallback(async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) return;

      const response = await axios.get(`${BASE_URL}/carts/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        }
      });
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  }, []);

  const addToCart = async (item) => {
    try {
      setCartItems(prevItems => {
        const existingItem = prevItems.find(i => 
          i.id === item.id && i.selectedSize === item.selectedSize
        );

        if (existingItem) {
          return prevItems.map(i => 
            i.id === item.id && i.selectedSize === item.selectedSize
              ? { ...i, quantity: i.quantity + 1 }
              : i
          );
        }
        return [...prevItems, { ...item, quantity: 1 }];
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) return;

      await axios.delete(`${BASE_URL}/carts/${user.id}/${productId}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        }
      });

      setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateCartItemQuantity = async (productId, newQuantity) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) return;

      await axios.put(`${BASE_URL}/carts/${user.id}/${productId}`, {
        quantity: newQuantity
      }, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        }
      });

      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (error) {
      console.error('Error updating cart quantity:', error);
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      products,
      addToCart,
      removeFromCart,
      updateCartItemQuantity,
      fetchCartItems
    }}>
      {children}
    </CartContext.Provider>
  );
};
