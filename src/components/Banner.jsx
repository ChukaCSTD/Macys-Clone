import React from 'react';
import { Link } from 'react-router-dom';
import nigeriaFlag from './images/nigeria.png';

function Banner() {
  return (
    <div className="banner">
      <div className="top-banner bg-black h-10"></div>
      <div className="top-banner flex justify-between items-center bg-white py-3 px-10 border-b">
        <div className="banner-left">
          <p className="text-[12px]">
            Sign up for emails & get an extra 25% off! Exclusions apply.&nbsp; 
            <Link to="/register" className="text-blue-500 underline">Sign Up</Link>
          </p>
        </div>
        <div className="banner-right">
          <ul className="flex space-x-4 text-[12px]">
            <li>Order Tracking</li>
            <li className='text-gray-300'>|</li>
            <li>Store</li>
            <li className='text-gray-300'>|</li>
            <li>Gift Registry</li>
            <li className='text-gray-300'>|</li>
            <li className='flex items-center gap-1'>Shipping to <img src={nigeriaFlag} alt="Nigeria flag" className="w-4 h-4 ml-1" /></li>
          </ul>
        </div>
      </div>
      
    </div>
  );
}

export default Banner;