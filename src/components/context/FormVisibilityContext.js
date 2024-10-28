import React, { createContext, useState } from 'react';

export const FormVisibilityContext = createContext();

const FormVisibilityProvider = ({ children }) => {
  const [isFormVisible, setFormVisible] = useState(false);

  const toggleFormVisibility = () => {
    setFormVisible((prev) => !prev);
  };

  return (
    <FormVisibilityContext.Provider value={{ isFormVisible, toggleFormVisibility }}>
      {children}
    </FormVisibilityContext.Provider>
  );
};

export default FormVisibilityProvider;
