import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { DashboardContext } from '../context/DashboardContext';
import { 
  BiInfoCircle, 
  BiTag, 
  BiListUl, 
  BiPlus,
  BiCheck,
  BiErrorCircle,
  BiTrash,
  BiEdit
} from 'react-icons/bi';
import { 
  MdCloudUpload, 
  MdLocalShipping,
  MdAttachMoney,
  MdColorLens
} from 'react-icons/md';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaBoxes, FaPercentage } from 'react-icons/fa';

const BASE_URL = 'http://ecommerce.reworkstaging.name.ng/v2';

const initialProductState = {
  title: '',
  descp: '',
  price: '',
  brand: '',
  quantity: 1,
  images: [],
  currency: 'NGN',
  min_qty: 1,
  max_qty: 10000,
  discount: 0,
  discount_expiration: '',
  has_refund_policy: false,
  refund_policy_days: 7,
  has_warranty: false,
  warranty_days: 0,
  has_discount: false,
  has_shipment: true,
  has_variation: false,
  shipping_locations: [],
  shipping_fee: 0,
  attrib: [],
  category_id: '',
  merchant_id: '',
  sku: '',
  weight: '',
  dimensions: {
    length: '',
    width: '',
    height: ''
  },
  meta_title: '',
  meta_description: '',
  tags: [],
  status: 'draft'
};

const CreateProduct = ({ onProductCreated }) => {
  const { merchantId: contextMerchantId, addProduct, formatProduct } = useContext(DashboardContext);
  
  const [product, setProduct] = useState({
    ...initialProductState,
    merchant_id: contextMerchantId
  });

  const [variations, setVariations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);
  const [activeTab, setActiveTab] = useState('basic'); // basic, pricing, attributes, shipping, seo

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/categories?merchant_id=${contextMerchantId}`);
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
    }
  }, [contextMerchantId]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const handleDimensionChange = useCallback((e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [name]: value
      }
    }));
  }, []);

  const handleTagsChange = useCallback((e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setProduct(prev => ({
      ...prev,
      tags
    }));
  }, []);

  const handleImageUpload = useCallback((e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    setProduct(prev => ({
      ...prev,
      images: [...prev.images, ...imageFiles]
    }));

    // Create preview URLs
    const newPreviewUrls = imageFiles.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviewUrls]);
  }, []);

  const removeImage = useCallback((index) => {
    setProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(previewImages[index]);
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  }, [previewImages]);

  const handleAttributeChange = useCallback((index, field, value) => {
    setProduct(prev => {
      const newAttrib = [...prev.attrib];
      newAttrib[index] = { 
        ...newAttrib[index], 
        [field]: field === 'content' ? value.split(',').map(item => item.trim()) : value 
      };
      return { ...prev, attrib: newAttrib };
    });
  }, []);

  const removeAttribute = useCallback((index) => {
    setProduct(prev => ({
      ...prev,
      attrib: prev.attrib.filter((_, i) => i !== index)
    }));
  }, []);

  const handleVariationChange = useCallback((index, field, value) => {
    setVariations(prev => {
      const newVariations = [...prev];
      newVariations[index] = { 
        ...newVariations[index], 
        [field]: field === 'content' ? value.split(',').map(item => item.trim()) : value 
      };
      return newVariations;
    });
  }, []);

  const removeVariation = useCallback((index) => {
    setVariations(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleShippingLocations = useCallback((e) => {
    const locations = e.target.value.split(',').map(loc => loc.trim());
    setProduct(prev => ({
      ...prev,
      shipping_locations: locations,
    }));
  }, []);

  const addAttribute = useCallback(() => {
    setProduct(prev => ({
      ...prev,
      attrib: [...prev.attrib, { type: '', content: [] }],
    }));
  }, []);

  const addVariation = useCallback(() => {
    setVariations(prev => [...prev, { type: '', text: '', content: [] }]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate product data
    const validationErrors = validateProduct(product);
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      setIsLoading(false);
      return;
    }

    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Append all product data
      Object.keys(product).forEach(key => {
        if (key === 'images') {
          product.images.forEach(image => {
            formData.append('images', image);
          });
        } else if (key === 'dimensions' || key === 'tags') {
          formData.append(key, JSON.stringify(product[key]));
        } else {
          formData.append(key, product[key]);
        }
      });

      // Add variations if any
      if (product.has_variation) {
        formData.append('variations', JSON.stringify(variations));
      }

      const response = await axios.post(
        `${BASE_URL}/products`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Add the new product to context
      addProduct(response.data);
      
      // Call callback if provided
      if (onProductCreated) {
        onProductCreated(response.data);
      }

      // Show success message
      alert('Product created successfully!');
      
      // Reset form
      setProduct({
        ...initialProductState,
        merchant_id: contextMerchantId
      });
      setVariations([]);
      setPreviewImages([]);

    } catch (error) {
      console.error('Error creating product:', error);
      setError(error.response?.data?.message || 'Failed to create product');
    } finally {
      setIsLoading(false);
    }
  };

  // Clean up preview URLs on unmount
  useEffect(() => {
    return () => {
      previewImages.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

  const validateProduct = (productData) => {
    const errors = [];
    
    if (!productData.title) errors.push('Product title is required');
    if (!productData.descp) errors.push('Product description is required');
    if (!productData.price || productData.price <= 0) errors.push('Valid price is required');
    if (!productData.category_id) errors.push('Category is required');
    if (productData.images.length === 0) errors.push('At least one image is required');
    
    return errors;
  };

  // Reset button handler
  const handleReset = () => {
    setProduct({
      ...initialProductState,
      merchant_id: contextMerchantId // Preserve the merchant ID
    });
    setPreviewImages([]); // Clear image previews
    setVariations([]); // Reset variations if you're tracking them separately
  };

  return (
    <div className="max-w-7xl mx-auto p-8 bg-gradient-to-b from-gray-50 to-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">
        Create New Product
      </h2>

      {/* Tab Navigation */}
      <div className="mb-8 border-b">
        <nav className="flex space-x-4">
          {[
            { id: 'basic', label: 'Basic Info', icon: <BiInfoCircle /> },
            { id: 'pricing', label: 'Pricing', icon: <MdAttachMoney /> },
            { id: 'inventory', label: 'Inventory', icon: <FaBoxes /> },
            { id: 'attributes', label: 'Attributes', icon: <BiListUl /> },
            { id: 'shipping', label: 'Shipping', icon: <MdLocalShipping /> },
            { id: 'seo', label: 'SEO & Meta', icon: <BiTag /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-t-lg transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-center">
            <BiErrorCircle className="text-red-500 text-xl flex-shrink-0" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="grid gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={product.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="descp"
                  value={product.descp}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  value={product.brand}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU (Stock Keeping Unit)
                </label>
                <input
                  type="text"
                  name="sku"
                  value={product.sku}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category_id"
                  value={product.category_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors duration-200">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="images"
                  />
                  <label htmlFor="images" className="cursor-pointer block text-center">
                    <MdCloudUpload className="mx-auto text-4xl text-gray-400 mb-2" />
                    <span className="text-gray-600">Drop images here or click to upload</span>
                  </label>
                </div>
                
                {/* Image Previews */}
                {previewImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-4 gap-4">
                    {previewImages.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <BiTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      {product.currency === 'NGN' ? '₦' : '$'}
                    </span>
                    <input
                      type="number"
                      name="price"
                      value={product.price}
                      onChange={handleInputChange}
                      className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    name="currency"
                    value={product.currency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="NGN">Nigerian Naira (₦)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="GBP">British Pound (£)</option>
                  </select>
                </div>
              </div>

              {/* Discount Section */}
              <div className="border-t pt-6">
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    name="has_discount"
                    checked={product.has_discount}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    id="has_discount"
                  />
                  <label htmlFor="has_discount" className="ml-2 text-sm font-medium text-gray-700">
                    Enable Discount
                  </label>
                </div>

                {product.has_discount && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discount Percentage
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name="discount"
                          value={product.discount}
                          onChange={handleInputChange}
                          className="w-full pr-8 pl-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="0"
                          max="100"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                          <FaPercentage />
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discount Expiration
                      </label>
                      <input
                        type="datetime-local"
                        name="discount_expiration"
                        value={product.discount_expiration}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Warranty & Refund Policy */}
              <div className="border-t pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        name="has_warranty"
                        checked={product.has_warranty}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        id="has_warranty"
                      />
                      <label htmlFor="has_warranty" className="ml-2 text-sm font-medium text-gray-700">
                        Include Warranty
                      </label>
                    </div>
                    {product.has_warranty && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Warranty Period (days)
                        </label>
                        <input
                          type="number"
                          name="warranty_days"
                          value={product.warranty_days}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="0"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        name="has_refund_policy"
                        checked={product.has_refund_policy}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        id="has_refund_policy"
                      />
                      <label htmlFor="has_refund_policy" className="ml-2 text-sm font-medium text-gray-700">
                        Enable Refund Policy
                      </label>
                    </div>
                    {product.has_refund_policy && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Refund Period (days)
                        </label>
                        <input
                          type="number"
                          name="refund_policy_days"
                          value={product.refund_policy_days}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="0"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="grid gap-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={product.quantity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Order Quantity
                  </label>
                  <input
                    type="number"
                    name="min_qty"
                    value={product.min_qty}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Order Quantity
                  </label>
                  <input
                    type="number"
                    name="max_qty"
                    value={product.max_qty}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Product Dimensions</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Length (cm)
                    </label>
                    <input
                      type="number"
                      name="length"
                      value={product.dimensions.length}
                      onChange={handleDimensionChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      step="0.1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Width (cm)
                    </label>
                    <input
                      type="number"
                      name="width"
                      value={product.dimensions.width}
                      onChange={handleDimensionChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      step="0.1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      name="height"
                      value={product.dimensions.height}
                      onChange={handleDimensionChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={product.weight}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>
          </div>
        )}

        {/* Attributes Tab */}
        {activeTab === 'attributes' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="space-y-6">
              {/* Product Attributes */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Product Attributes</h3>
                  <button
                    type="button"
                    onClick={addAttribute}
                    className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                  >
                    <BiPlus className="mr-2" />
                    Add Attribute
                  </button>
                </div>

                <div className="space-y-4">
                  {product.attrib.map((attr, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Attribute Type
                            </label>
                            <input
                              type="text"
                              value={attr.type}
                              onChange={(e) => handleAttributeChange(index, 'type', e.target.value)}
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="e.g., Color, Size, Material"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Values (comma-separated)
                            </label>
                            <input
                              type="text"
                              value={attr.content.join(', ')}
                              onChange={(e) => handleAttributeChange(index, 'content', e.target.value)}
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="e.g., Red, Blue, Green"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttribute(index)}
                          className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <BiTrash className="text-xl" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Variations Section */}
              <div className="border-t pt-6">
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    name="has_variation"
                    checked={product.has_variation}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    id="has_variation"
                  />
                  <label htmlFor="has_variation" className="ml-2 text-sm font-medium text-gray-700">
                    Enable Product Variations
                  </label>
                </div>

                {product.has_variation && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-md font-medium text-gray-700">Variations</h4>
                      <button
                        type="button"
                        onClick={addVariation}
                        className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                      >
                        <BiPlus className="mr-2" />
                        Add Variation
                      </button>
                    </div>

                    {variations.map((variation, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Variation Type
                              </label>
                              <input
                                type="text"
                                value={variation.type}
                                onChange={(e) => handleVariationChange(index, 'type', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., Color, Size"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Options (comma-separated)
                              </label>
                              <input
                                type="text"
                                value={variation.content.join(', ')}
                                onChange={(e) => handleVariationChange(index, 'content', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., Small, Medium, Large"
                              />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeVariation(index)}
                            className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          >
                            <BiTrash className="text-xl" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Shipping Tab */}
        {activeTab === 'shipping' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  name="has_shipment"
                  checked={product.has_shipment}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  id="has_shipment"
                />
                <label htmlFor="has_shipment" className="ml-2 text-sm font-medium text-gray-700">
                  This product requires shipping
                </label>
              </div>

              {product.has_shipment && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shipping Locations
                    </label>
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={product.shipping_locations.join(', ')}
                        onChange={handleShippingLocations}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter locations separated by commas (e.g., Lagos, Abuja, Port Harcourt)"
                      />
                      <p className="text-sm text-gray-500">
                        Enter the locations where this product can be shipped to
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Base Shipping Fee
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        {product.currency === 'NGN' ? '₦' : '$'}
                      </span>
                      <input
                        type="number"
                        name="shipping_fee"
                        value={product.shipping_fee}
                        onChange={handleInputChange}
                        className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      This is the base shipping fee. Actual shipping cost may vary based on location and quantity.
                    </p>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Restrictions</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="restricted_shipping"
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="restricted_shipping" className="ml-2 text-sm text-gray-700">
                          This product has shipping restrictions
                        </label>
                      </div>
                      <textarea
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows="3"
                        placeholder="Enter any shipping restrictions or special handling requirements..."
                      ></textarea>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === 'seo' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  name="meta_title"
                  value={product.meta_title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter SEO-friendly title"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Recommended length: 50-60 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  name="meta_description"
                  value={product.meta_description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter SEO-friendly description"
                ></textarea>
                <p className="mt-1 text-sm text-gray-500">
                  Recommended length: 150-160 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Tags
                </label>
                <input
                  type="text"
                  value={product.tags.join(', ')}
                  onChange={handleTagsChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter tags separated by commas"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Add relevant tags to help customers find your product
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Status
                </label>
                <select
                  name="status"
                  value={product.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Form Submit Button */}
        <div className="sticky bottom-0 bg-white p-4 border-t shadow-lg mt-8 -mx-8 -mb-8 rounded-b-2xl">
          <div className="max-w-7xl mx-auto flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <AiOutlineLoading3Quarters className="animate-spin" />
                  <span>Creating Product...</span>
                </>
              ) : (
                <>
                  <BiCheck className="text-xl" />
                  <span>Create Product</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
