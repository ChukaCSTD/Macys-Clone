import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { DashboardContext } from '../context/DashboardContext'; // Correct import
import { FormVisibilityContext } from '../context/FormVisibilityContext'; // Import the FormVisibilityContext
import logo from '../images/logo.svg';
import backgroundImage from '../images/digital-art-fashion-design-studio.jpg';
import { IoMdExit } from "react-icons/io";

const BASE_URL = 'http://ecommerce.reworkstaging.name.ng/v2';

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    storeName: '',
    storeDescription: '',
    iconUrl: '',
    bannerUrl: '',
    optionalPhone: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();
  const { setUser, setMerchantId } = useContext(DashboardContext); // Destructure setMerchantId from context
  const { isFormVisible, toggleFormVisibility } = useContext(FormVisibilityContext); // Get form visibility state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.mobileNumber,
        store_name: formData.storeName,
        descp: formData.storeDescription,
        icon: formData.iconUrl,
        banner: formData.bannerUrl,
        phones: formData.optionalPhone ? [formData.mobileNumber, formData.optionalPhone] : [formData.mobileNumber],
        password: formData.password,
      };

      const response = await axios.post(`${BASE_URL}/merchants`, payload);
      const merchantData = response.data;
      setUser(merchantData);
      setMerchantId(merchantData.id);
      
      localStorage.setItem('merchantId', merchantData.id);
      localStorage.setItem('userData', JSON.stringify(merchantData));
      
      console.log('Merchant registered successfully:', merchantData);
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error registering merchant:', error);
    }
  };

  const handleClose = () => {
    setFormData({ // Clear user entries
      firstName: '',
      lastName: '',
      email: '',
      mobileNumber: '',
      storeName: '',
      storeDescription: '',
      iconUrl: '',
      bannerUrl: '',
      optionalPhone: '',
      password: '',
      confirmPassword: '',
    });
    toggleFormVisibility(); // Toggle visibility of the form
  };

  return (
    <div 
      className="flex justify-end items-center h-screen" 
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'left', backgroundRepeat: 'no-repeat' }}
    >
      <div className={`transition-transform ${isFormVisible ? 'visible' : 'hidden'}`}>
        <form onSubmit={handleSubmit} className="bg-white bg-opacity-80 p-6 rounded shadow-md mr-28 w-[500px] ">
          <button 
            type="button" 
            onClick={handleClose} 
            className="absolute text-[10px] top-4 right-32 button-scale"
          >
            <IoMdExit className="text-3xl" /> close
          </button> {/* Close button */}
            <div className='flex flex-col justify-center items-center'>
              <div className='flex justify-center items-center gap-2'>
                <h2 className="text-xl mb-2">Register your </h2>
                <img src={logo} alt="Logo" className="w-24 -mt-2" />
              </div>
              <h2 className="text-xl mb-4"> Merchant/Vendor Account</h2>
            </div>
            <div className='flex flex-col'>
                <div className="grid md:grid-cols-2 md:gap-6">
                  <div className="relative z-0 w-full mb-5 group">
                    <input type="text" name="firstName" id="floating_first_name" onChange={handleChange} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-400 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label htmlFor="firstName" className="peer-focus:font-medium absolute text-sm left-1 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">First name <span className='text-red-500'>*</span></label>
                  </div>

                  <div className="relative z-0 w-full mb-5 group">
                    <input type="text" name="lastName" id="floating_last_name" onChange={handleChange} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-400 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label htmlFor="lastName" className="peer-focus:font-medium absolute text-sm left-1 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Last name <span className='text-red-500'>*</span></label>
                  </div>
                </div>

                <div className="relative z-0 w-full mb-5 group">
                  <input type="email" name="email" id="floating_email" onChange={handleChange} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                  <label htmlFor="email" className="peer-focus:font-medium absolute text-sm left-1 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address <span className='text-red-500'>*</span></label>
                </div>

                <div className="relative z-0 w-full mb-5 group">
                  <input type="tel" name="mobileNumber" id="floating_phone" onChange={handleChange} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                  <label htmlFor="mobileNumber" className="peer-focus:font-medium absolute text-sm left-1 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Hotline <span className='text-red-500'>*</span></label>
                </div>

                <div className="relative z-0 w-full mb-5 group">
                  <input type="text" name="storeName" id="floating_store_name" onChange={handleChange} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                  <label htmlFor="storeName" className="peer-focus:font-medium absolute text-sm left-1 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Store name <span className='text-red-500'>*</span></label>
                </div>

                <div className="relative z-0 w-full mb-5 group">
                  <textarea name="storeDescription" id="floating_store_description" onChange={handleChange} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                  <label htmlFor="storeDescription" className="peer-focus:font-medium absolute text-sm left-1 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">What's your store about? <span className='text-red-500'>*</span></label>
                </div>

                <div className='grid md:grid-cols-2 md:gap-6'>
                  <div className="relative z-0 w-full mb-5 group">
                    <input type="text" name="iconUrl" id="floating_icon_url" onChange={handleChange} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label htmlFor="iconUrl" className="peer-focus:font-medium absolute text-sm left-1 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Icon URL <span className='text-red-500'>*</span></label>
                  </div>

                  <div className="relative z-0 w-full mb-5 group">
                    <input type="text" name="bannerUrl" id="floating_banner_url" onChange={handleChange} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label htmlFor="bannerUrl" className="peer-focus:font-medium absolute text-sm left-1 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Banner URL <span className='text-red-500'>*</span></label>
                  </div>
                </div>

                <div className="relative z-0 w-full mb-5 group">
                  <input type="tel" name="optionalPhone" id="floating_optional_phone" onChange={handleChange} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                  <label htmlFor="optionalPhone" className="peer-focus:font-medium absolute text-sm left-1 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Optional phone number</label>
                </div>

                <div className="grid md:grid-cols-2 md:gap-6">
                  <div className="relative z-0 w-full mb-5 group">
                    <input type="password" name="password" id="floating_password" onChange={handleChange} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label htmlFor="password" className="peer-focus:font-medium absolute text-sm left-1 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password <span className='text-red-500'>*</span></label>
                  </div>

                  <div className="relative z-0 w-full mb-5 group">
                    <input type="password" name="confirmPassword" id="floating_confirm_password" onChange={handleChange} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label htmlFor="confirmPassword" className="peer-focus:font-medium absolute text-sm left-1 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Confirm Password <span className='text-red-500'>*</span></label>
                  </div>
                </div>

                <button type="submit" className="bg-gradient-to-bl from-zinc-400 to-slate-800 hover:from-gray-600 hover:to-gray-900 text-white p-2 rounded w-1/6 m-auto transition duration-300 ease-in-out">Register</button>
            </div>
            <p className="mt-4 text-[11px]">
              Already a registered Merchant/Vendor? <Link to="/adminLogin" className="text-blue-500 underline">Click Here</Link>
            </p>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;