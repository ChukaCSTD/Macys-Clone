import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { DashboardContext } from '../context/DashboardContext';

const BASE_URL = 'http://ecommerce.reworkstaging.name.ng/v2';

const CreateProduct = ({ onProductCreated }) => {
  const { merchantId: contextMerchantId, addProduct, formatProduct } = useContext(DashboardContext);
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({
    title: '',
    descp: '',
    price: 0,
    brand: '',
    quantity: 1,
    images: [],
    currency: 'NGN',
    min_qty: 1,
    max_qty: 10000,
    discount: 0,
    discount_expiration: '',
    has_refund_policy: false,
    has_discount: false,
    has_shipment: true,
    has_variation: false,
    shipping_locations: [],
    attrib: [],
    category_id: '',
    merchant_id: contextMerchantId,
  });
  const [variations, setVariations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/categories?merchant_id=${contextMerchantId}`);
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  }, [contextMerchantId]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const handleImageUpload = useCallback((e) => {
    const files = Array.from(e.target.files);
    setProduct(prev => ({
      ...prev,
      images: files.map(file => URL.createObjectURL(file)),
    }));
  }, []);

  const handleShippingLocations = useCallback((e) => {
    const locations = e.target.value.split(',').map(loc => loc.trim());
    setProduct(prev => ({
      ...prev,
      shipping_locations: locations,
    }));
  }, []);

  const handleAttributeChange = useCallback((index, field, value) => {
    setProduct(prev => {
      const newAttrib = [...prev.attrib];
      newAttrib[index] = { ...newAttrib[index], [field]: value };
      return { ...prev, attrib: newAttrib };
    });
  }, []);

  const addAttribute = useCallback(() => {
    setProduct(prev => ({
      ...prev,
      attrib: [...prev.attrib, { type: '', content: [] }],
    }));
  }, []);

  const handleVariationChange = useCallback((index, field, value) => {
    setVariations(prev => {
      const newVariations = [...prev];
      newVariations[index] = { ...newVariations[index], [field]: value };
      return newVariations;
    });
  }, []);

  const addVariation = useCallback(() => {
    setVariations(prev => [...prev, { type: '', text: '', content: [] }]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Format the product data before sending
    const formattedProduct = formatProduct({
      ...product,
      merchant_id: contextMerchantId
    });

    try {
      const response = await axios.post(
        `${BASE_URL}/products`,
        formattedProduct,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Add the new product to context
      addProduct(response.data);
      
      // Call callback if provided
      if (onProductCreated) {
        onProductCreated(response.data);
      }

      // Reset form
      setProduct({
        title: '',
        descp: '',
        price: 0,
        brand: '',
        quantity: 1,
        images: [],
        currency: 'NGN',
        min_qty: 1,
        max_qty: 10000,
        discount: 0,
        discount_expiration: '',
        has_refund_policy: false,
        has_discount: false,
        has_shipment: true,
        has_variation: false,
        shipping_locations: [],
        attrib: [],
        category_id: '',
        merchant_id: contextMerchantId,
      });

      alert('Product created successfully!');
      setIsLoading(false);

    } catch (error) {
      console.error('Error creating product:', error);
      setError(error.response?.data?.message || 'Failed to create product');
      setIsLoading(false);
    }
  };

  return (
    <>

      <h2 className="text-2xl font-bold mb-4">Create New Product</h2>
    <form onSubmit={handleSubmit} className="space-y-4 grid grid-cols-2 gap-4">
      
      <div className="grid grid-rows-1 gap-4">
        <div>
          <label className="block mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={product.title}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <textarea
            name="descp"
            value={product.descp}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Brand</label>
          <input
            type="text"
            name="brand"
            value={product.brand}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className='w-1/3'>
          <label className="block mb-1">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={product.quantity}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            min="1"
            max="10000"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Currency</label>
          <select
            name="currency"
            value={product.currency}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="NGN">NGN (Nigerian Naira)</option>
            <option value="USD">USD (US Dollar)</option>
            <option value="EUR">EUR (Euro)</option>
            <option value="GBP">GBP (British Pound)</option>
            {/* Add more currency options as needed */}
          </select>
        </div>

        
          <div>
            <label className="block mb-1">Discount (%)</label>
            <input
              type="number"
              name="discount"
              value={product.discount}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              min="0"
              max="100"
            />
          </div>

          <div>
            <label className="block mb-1">Discount Expiration</label>
            <input
              type="date"
              name="discount_expiration"
              value={product.discount_expiration}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
        
      </div>

      <div className="w-1/2">
        <label className="block mb-1">Images</label>
        <input
          type="file"
          multiple
          onChange={handleImageUpload}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block mb-1">Shipping Locations (comma-separated)</label>
        <input
          type="text"
          value={product.shipping_locations.join(', ')}
          onChange={handleShippingLocations}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Attributes */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Attributes</h3>
        {product.attrib.map((attr, index) => (
          <div key={index} className="mb-2">
            <input
              type="text"
              value={attr.type}
              onChange={(e) => handleAttributeChange(index, 'type', e.target.value)}
              placeholder="Attribute Type"
              className="w-full p-2 border rounded mb-1"
            />
            <input
              type="text"
              value={attr.content.join(', ')}
              onChange={(e) => handleAttributeChange(index, 'content', e.target.value.split(',').map(item => item.trim()))}
              placeholder="Attribute Content (comma-separated)"
              className="w-full p-2 border rounded mb-1"
            />
          </div>
        ))}
        <button type="button" onClick={addAttribute} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Attribute
        </button>
      </div>

      {/* Variations */}
      <div>
        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            name="has_variation"
            checked={product.has_variation}
            onChange={handleInputChange}
            className="mr-2"
          />
          Has Variations
        </label>
        {product.has_variation && (
          <div>
            {variations.map((variation, index) => (
              <div key={index} className="mb-2">
                <input
                  type="text"
                  value={variation.type}
                  onChange={(e) => handleVariationChange(index, 'type', e.target.value)}
                  placeholder="Variation Type (e.g., color, size)"
                  className="w-full p-2 border rounded mb-1"
                />
                <input
                  type="text"
                  value={variation.text}
                  onChange={(e) => handleVariationChange(index, 'text', e.target.value)}
                  placeholder="Variation Text"
                  className="w-full p-2 border rounded mb-1"
                />
                {/* Add inputs for variation content */}
              </div>
            ))}
            <button type="button" onClick={addVariation} className="bg-blue-500 text-white px-4 py-2 rounded">
              Add Variation
            </button>
          </div>
        )}
      </div>

      <div>
        <label className="block mb-1">Category</label>
        <select
          name="category_id"
          value={product.category_id}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-red-500">{error}</p>}

    </form>
      <button 
        type="submit" 
        className="bg-green-500 text-white px-6 py-3 mt-4 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out"
        disabled={isLoading}
      >
        {isLoading ? 'Creating...' : 'Create Product'}
      </button>
    </>
  );
};

export default CreateProduct;
