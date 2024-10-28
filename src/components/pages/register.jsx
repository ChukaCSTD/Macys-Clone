import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    apiError: ''
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: '',
      apiError: ''
    });
  };

  const validateForm = () => {
    let isValid = true;
    let tempErrors = { ...errors };

    if (!formData.username) {
      tempErrors.username = 'Username is required';
      isValid = false;
    }

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

    if (!formData.confirmPassword) {
      tempErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setLoading(true);
        const userDetails = {
          id: Date.now(),
          username: formData.username,
          email: formData.email,
          password: formData.password,
        };
        localStorage.setItem('userDetails', JSON.stringify(userDetails));
        alert('Registration successful!');
        navigate('/');
      } catch (error) {
        setErrors({ 
          ...errors, 
          apiError: 'Failed to create account. Please try again.' 
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto p-6 w-[500px]">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      {errors.apiError && <p className="text-red-500">{errors.apiError}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="username"
            id="floating_username"
            value={formData.username}
            onChange={handleChange}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            
          />
          <label htmlFor="username" className="peer-focus:font-medium absolute text-sm left-1 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Username
          </label>
          {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}
        </div>

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
          <label htmlFor="password" className="peer-focus:font-medium absolute text-sm left-1 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Password
          </label>
          {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
        </div>

        <div className="relative z-0 w-full mb-5 group">
          <input
            type="password"
            name="confirmPassword"
            id="floating_confirm_password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            
          />
          <label htmlFor="confirmPassword" className="peer-focus:font-medium absolute text-sm left-1 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Confirm Password
          </label>
          {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
        </div>

        <button 
          type="submit" 
          className="bg-black text-white px-4 py-2 rounded w-full"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p className="mt-4 text-[13px]">
        Already have an account? <Link to="/login" className="text-blue-500 underline">Login here</Link>
      </p>
      <p className="mt-4 font-medium text-[13px]">
        Want to be a registered Merchant/Vendor? <Link to="/adminRegister" className="text-blue-500 underline">Become a Merchant/Vendor</Link>
      </p>
    </div>
  );
};

export default Register;
