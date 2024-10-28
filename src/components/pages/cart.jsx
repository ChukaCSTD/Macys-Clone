import React, { useEffect, useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { DashboardContext } from '../context/DashboardContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateCartItemQuantity, fetchCartItems } = useContext(CartContext);
  const { products } = useContext(DashboardContext);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  // Add these new functions from CartPage.jsx
  const findMatchingProducts = (orders, products) => {
    if (!Array.isArray(orders)) {
      console.error('Expected orders to be an array, but got:', orders);
      return [];
    }

    const matchedProducts = [];
    orders.forEach(order => {
      order.products.forEach(orderProduct => {
        const matchingProduct = products.find(product => product.id === orderProduct.id);
        if (matchingProduct) {
          matchedProducts.push({
            ...matchingProduct,
            orderQuantity: orderProduct.quantity,
            orderAmount: orderProduct.amount
          });
        }
      });
    });
    return matchedProducts;
  };

  // Get matched products
  const matchedProducts = findMatchingProducts(cartItems, products);

  // Update the total amount calculation
  useEffect(() => {
    const total = matchedProducts.reduce((acc, item) => {
      const price = parseFloat(item.price);
      return acc + (isNaN(price) ? 0 : price * item.orderQuantity);
    }, 0);
    setTotalAmount(total);
  }, [cartItems, matchedProducts]);

  // Update the handleIncrement/handleDecrement logic
  const handleIncrement = (id) => {
    const item = matchedProducts.find(item => item.id === id);
    if (item) {
      updateCartItemQuantity(id, item.orderQuantity + 1);
    }
  };

  const handleDecrement = (id) => {
    const item = matchedProducts.find(item => item.id === id);
    if (item && item.orderQuantity > 1) {
      updateCartItemQuantity(id, item.orderQuantity - 1);
    }
  };

  return (
    <div className='flex'>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 ml-6 text-left">Your Bag</h1>
        {matchedProducts.length === 0 ? (
          <p>Your cart is empty. <Link to="/" className="text-black underline">Continue Shopping</Link></p>
        ) : (
          <div className='w-[800px] ml-6 border-t py-6'>
            <ul className="space-y-4">
              {matchedProducts.map(item => (
                <li key={item.id} className="flex justify-between items-center border-b pb-4">
                  <div className="flex items-center">
                    <img src={item.images[0]} alt={item.title} className="w-20 h-20 object-cover rounded" />
                    <div className="ml-4">
                      <h2 className="text-lg font-semibold underline">{item.title}</h2>
                      <p className="text-gray-600">Price: ${item.price}</p>
                      <p className="text-gray-600">Quantity: {item.orderQuantity}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button onClick={() => handleDecrement(item.id)} className="text-gray-600 px-2">-</button>
                    <span className="mx-2">{item.orderQuantity}</span>
                    <button onClick={() => handleIncrement(item.id)} className="text-gray-600 px-2">+</button>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 underline ml-4"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <h2 className="text-xl font-bold">Total: ${totalAmount.toFixed(2)}</h2>
              <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4">Proceed to Checkout</button>
            </div>
          </div>
        )}
      </div>
      {/* Promo code section */}
      <div className="m-6 ml-6 border-b p-8 w-[800px]">
        <h1 className="text-[14px] font-semibold mb-4 text-left">Enter promo code <span className='text-gray-500'>Limit 1 code per order</span></h1>
        <div className="flex">
          <input type="text" className="border border-gray-300 rounded-l px-4 py-2 w-full" placeholder="Enter promo code" />
          <button className="bg-black text-white px-4 py-2 rounded-r">Apply</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
