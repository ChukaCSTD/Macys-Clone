import React, { createContext, useState, useEffect, useContext } from 'react';
import { DashboardContext } from './DashboardContext';

export const LikeContext = createContext();

export const LikeProvider = ({ children }) => {
  const [likedProducts, setLikedProducts] = useState({});
  const { merchantId } = useContext(DashboardContext);
  const BASE_URL = 'http://ecommerce.reworkstaging.name.ng/v2';

  useEffect(() => {
    const storedLikes = localStorage.getItem('likedProducts');
    if (storedLikes) {
      setLikedProducts(JSON.parse(storedLikes));
    }
  }, []);

  const toggleLike = async (productId) => {
    const newLikedProducts = { ...likedProducts };
    newLikedProducts[productId] = !newLikedProducts[productId];
    setLikedProducts(newLikedProducts);
    localStorage.setItem('likedProducts', JSON.stringify(newLikedProducts));

    try {
      if (newLikedProducts[productId]) {
        await createLike(productId);
      } else {
        await deleteLike(productId);
      }
    } catch (error) {
      console.error('Error updating like status:', error);
    }
  };

  const getLikedUsers = async (productId) => {
    try {
      const response = await fetch(`${BASE_URL}/liked?product_id=${productId}`);
      if (!response.ok) {
        throw new Error('Failed to get liked users');
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting liked users:', error);
      return [];
    }
  };

  const createLike = async (productId) => {
    try {
      const response = await fetch(`${BASE_URL}/likes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: productId,
          user_id: merchantId, // Assuming merchantId is the user_id for the merchant
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to create like');
      }
    } catch (error) {
      console.error('Error creating like:', error);
      throw error;
    }
  };

  const deleteLike = async (productId) => {
    try {
      const response = await fetch(`${BASE_URL}/likes`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: productId,
          user_id: merchantId, // Assuming merchantId is the user_id for the merchant
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete like');
      }
    } catch (error) {
      console.error('Error deleting like:', error);
      throw error;
    }
  };

  return (
    <LikeContext.Provider value={{ likedProducts, toggleLike, getLikedUsers }}>
      {children}
    </LikeContext.Provider>
  );
};
