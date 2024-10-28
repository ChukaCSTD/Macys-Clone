import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Add this import

const Login = () => {
  // Update state to match UserLog structure
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    keepSignedIn: false,
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Add handleChange function
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setErrors({
      ...errors,
      [name]: '',
    });
  };

  // Add form validation
  const validateForm = () => {
    let isValid = true;
    let tempErrors = { email: '', password: '' };

    if (!formData.email) {
      tempErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Email is invalid, check the format';
      isValid = false;
    }

    if (!formData.password) {
      tempErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 7) {
      tempErrors.password = 'Password must be at least 7 characters';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  // Update handleLogin to use API
  const handleLogin = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setLoading(true);
        const response = await axios.post('http://ecommerce.reworkstaging.name.ng/v2/users/login', {
          email: formData.email,
          password: formData.password
        });

        const userData = response.data;
        console.log('User logged in:', userData);

        if (formData.keepSignedIn) {
          localStorage.setItem('user', JSON.stringify(userData));
        }

        alert('Login successful!');
        navigate('/');
      } catch (error) {
        console.error('Login error:', error.response ? error.response.data : error.message);
        setErrors({ ...errors, apiError: 'Login failed. Please check your credentials.' });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto p-6 w-[500px]">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {errors.apiError && <p className="text-red-500">{errors.apiError}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="email"
            id="floating_email"
            value={formData.email}
            onChange={handleChange}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            
          />
          <label htmlFor="email" className="peer-focus:font-medium absolute text-sm left-1 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Email
          </label>
          {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
        </div>

        <div className="relative z-0 w-full mb-5 group">
          <input
            type="password"
            name="password"
            id="floating_password"
            value={formData.password}
            onChange={handleChange}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            
          />
          <label htmlFor="password" className="peer-focus:font-medium absolute text-sm left-1 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Password
          </label>
          {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="keepSignedIn"
            checked={formData.keepSignedIn}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-sm">Keep me signed in</label>
        </div>

        <button 
          type="submit" 
          className="bg-black text-white px-4 py-2 rounded w-full"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="mt-4 text-[13px]">
        Don't have an account? <Link to="/register" className="text-blue-500 underline">Sign up here</Link>
      </p>
      <p className="mt-4 font-semibold text-[13px]">
        Have a Merchant/Vendor account with us? <Link to="/adminRegister" className="text-blue-500 underline">Become a Merchant/Vendor</Link>
      </p>
    </div>
  );
};

export default Login;
