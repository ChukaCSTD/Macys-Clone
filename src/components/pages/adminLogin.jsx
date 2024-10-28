import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { DashboardContext } from '../context/DashboardContext'; // Assuming you have a context for managing state
import logo from '../images/logo.svg'; // Import the logo
import backgroundImage from '../images/futuristic-store.jpg';

const BASE_URL = 'http://ecommerce.reworkstaging.name.ng/v2';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { setUser, setMerchantId } = useContext(DashboardContext); // Get setMerchantId from context

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/merchants/login`, credentials);
      const merchantData = response.data;
      setUser(merchantData);
      setMerchantId(merchantData.id);
      
      localStorage.setItem('merchantId', merchantData.id);
      localStorage.setItem('userData', JSON.stringify(merchantData));
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div 
      className="flex flex-col pt-20 items-center h-screen"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'left',  backgroundRepeat: 'no-repeat' }}

    >
      <div className="transform transition-transform duration-300 hover:scale-125">
        <img src={logo} alt="Logo" className="mb-4 w-24 h-24" /> {/* Add the logo image */}
        <form onSubmit={handleSubmit} className="bg-white bg-opacity-80 w-96 p-6 rounded shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-2xl font-bold mb-4 uppercase">Merchant Login</h2>
          <div className='flex flex-col'>
            <div className="relative z-0 w-full mb-5 group">
                <input type="email" name="email" id="floating_email" onChange={handleChange} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm left-1 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
            </div>

            <div className="relative z-0 w-full mb-5 group">
              <input type="password" name="password" id="floating_password" onChange={handleChange} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
              <label htmlFor="floating_password" className="peer-focus:font-medium absolute text-sm left-1 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
            </div>

            {/* <input type="email" name="email" placeholder="Email" onChange={handleChange} className="mb-2 p-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" required /> */}
            {/* <input type="password" name="password" placeholder="Password" onChange={handleChange} className="mb-2 p-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" required /> */}
            <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors duration-300">Login</button>
          </div>
          <p className="mt-4 text-[12px]">
            Don't have a Merchant/Vendor account with us yet? <br /> <Link to="/adminRegister" className="text-blue-500 underline hover:text-blue-700 transition-colors duration-300">Sign Up here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;