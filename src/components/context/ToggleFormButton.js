import React, { useContext } from 'react';
import { FormVisibilityContext } from './FormVisibilityContext';
import logo from '../images/logo.svg'; // Importing the logo
import { useLocation } from 'react-router-dom'; // Import useLocation

const ToggleFormButton = () => {
  const { isFormVisible, toggleFormVisibility } = useContext(FormVisibilityContext);
  const location = useLocation(); // Get the current location

  return (
    <>
      {location.pathname === '/adminRegister' && !isFormVisible && ( // Only show button if on adminRegister page and form is not visible
        <button 
          onClick={toggleFormVisibility} 
          className="bg-black bg-opacity-10 absolute right-72 top-1/4 text-white font-bold p-4 rounded button-scale" // Added button-scale class
        >
          <img src={logo} alt="Logo" /> {/* Adding the logo here */}
          <p>Get Started, You'll be glad you came!</p>
        </button>
      )}
    </>
  );
};

export default ToggleFormButton;
