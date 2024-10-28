import React, { createContext, useState, useEffect, useCallback } from 'react';

export const DashboardContext = createContext();

const DashboardProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [merchantId, setMerchantId] = useState(null);
  const [products, setProducts] = useState([]);

  // Load initial data from localStorage
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    const storedMerchantId = localStorage.getItem('merchantId');
    const storedProducts = localStorage.getItem('products');
    
    if (storedUserData) {
      setUser(JSON.parse(storedUserData));
    }
    if (storedMerchantId) {
      setMerchantId(storedMerchantId);
    }
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
  }, []);

  // Format product data to ensure consistent structure
  const formatProduct = useCallback((product) => {
    return {
      id: product.id,
      title: product.title || product.name,
      name: product.title || product.name,
      descp: product.descp || product.description,
      price: parseFloat(product.price) || 0,
      brand: product.brand || 'Nike',
      quantity: parseInt(product.quantity) || 0,
      images: Array.isArray(product.images) ? product.images : 
              product.imageUrl ? [product.imageUrl] : [],
      currency: product.currency || 'USD',
      min_qty: parseInt(product.min_qty) || 1,
      max_qty: parseInt(product.max_qty) || 10000,
      discount: parseFloat(product.discount) || 0,
      discount_expiration: product.discount_expiration || null,
      has_refund_policy: Boolean(product.has_refund_policy),
      has_discount: Boolean(product.has_discount),
      has_shipment: Boolean(product.has_shipment),
      has_variation: Boolean(product.has_variation),
      shipping_locations: Array.isArray(product.shipping_locations) ? 
                         product.shipping_locations : [],
      attrib: Array.isArray(product.attrib) ? product.attrib : [],
      category_id: product.category_id || null,
      merchant_id: product.merchant_id || merchantId,
      rating: parseFloat(product.rating) || 0,
      reviews: parseInt(product.reviews) || 0,
      created_at: product.created_at || new Date().toISOString(),
      updated_at: product.updated_at || new Date().toISOString()
    };
  }, [merchantId]);

  // Add a new product
  const addProduct = useCallback((newProduct) => {
    setProducts(prevProducts => {
      const formattedProduct = formatProduct(newProduct);
      const updatedProducts = [...prevProducts, formattedProduct];
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      return updatedProducts;
    });
  }, [formatProduct]);

  // Update an existing product
  const updateProduct = useCallback((updatedProduct) => {
    setProducts(prevProducts => {
      const formattedProduct = formatProduct(updatedProduct);
      const updatedProducts = prevProducts.map(product => 
        product.id === formattedProduct.id ? formattedProduct : product
      );
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      return updatedProducts;
    });
  }, [formatProduct]);

  // Delete a product
  const deleteProduct = useCallback((productId) => {
    setProducts(prevProducts => {
      const updatedProducts = prevProducts.filter(product => product.id !== productId);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      return updatedProducts;
    });
  }, []);

  // Get a single product by ID
  const getProduct = useCallback((productId) => {
    return products.find(product => product.id === productId);
  }, [products]);

  return (
    <DashboardContext.Provider value={{ 
      user, 
      setUser, 
      merchantId, 
      setMerchantId, 
      products, 
      setProducts, 
      addProduct,
      updateProduct,
      deleteProduct,
      getProduct,
      formatProduct
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardProvider;
