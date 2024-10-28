import React, { useEffect, useState, useContext, useCallback, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { DashboardContext } from '../context/DashboardContext';
import { FaUser, FaEdit, FaEye, FaSave, FaBars, FaBox, FaList, FaHeart, FaStar, FaShoppingCart, FaUsers, FaImage, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock, FaSignOutAlt, FaArrowLeft, FaTimes } from 'react-icons/fa';
import CategoryManager from './CategoryManager';
import CreateProduct from './CreateProduct';
import ViewProducts from './ViewProducts';
import { LikeContext } from '../context/LikeContext';
import Shoe1 from '../images/shoes/26926238_fpx.webp';
import Shoe2 from '../images/shoes/29156443_fpx.webp';
import Shoe3 from '../images/shoes/29519995_fpx.webp';
import Shoe4 from '../images/shoes/29116166_fpx.webp';

const BASE_URL = 'http://ecommerce.reworkstaging.name.ng/v2';

const sampleProducts = [
  {
    id: 1,
    name: "Women's Free Metcon 6 Training Sneakers from Finish Line",
    price: 150.00,
    oldPrice: 180.00,
    imageUrl: Shoe1,
    rating: 4.5,
    reviews: 60,
    color: "White/Black",
    brand: "Nike",
    likes: 45,
    sales: 30,
    stock: 15
  },
  {
    id: 2,
    name: "Women's Pegasus 41 Running Sneakers from Finish Line",
    price: 160.00,
    imageUrl: Shoe2,
    rating: 4.7,
    reviews: 133,
    color: "Brown/White",
    brand: "Nike",
    likes: 67,
    sales: 45,
    stock: 8
  },
  {
    id: 3,
    name: "Women's V2K Run Running Sneakers from Finish Line",
    price: 120.00,
    oldPrice: 140.00,
    imageUrl: Shoe3,
    rating: 3,
    reviews: 8,
    color: "Black/White",
    brand: "Nike",
    likes: 12,
    sales: 8,
    stock: 20
  },
  {
    id: 4,
    name: "Women's React Infinity Run Flyknit 4 Running Sneakers from Finish Line",
    price: 100.00,
    imageUrl: Shoe4,
    rating: 4.0,
    reviews: 150,
    color: "Gray/Pink",
    brand: "Nike",
    likes: 89,
    sales: 55,
    stock: 5
  }
];

const Dashboard = () => {
  const { user, setUser, merchantId, setMerchantId } = useContext(DashboardContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ old_password: '', new_password: '' });
  const [passwordError, setPasswordError] = useState(null);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const [showViewProducts, setShowViewProducts] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('main');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const { getLikedUsers } = useContext(LikeContext);
  const [likedUsers, setLikedUsers] = useState([]);
  const [likes, setLikes] = useState(0);
  const [reviews, setReviews] = useState(0);
  const [sales, setSales] = useState(0);
  const [users, setUsers] = useState(0);
  const [rating, setRating] = useState(0);

  const fetchMerchantData = useCallback(async () => {
    const storedMerchantId = localStorage.getItem('merchantId');
    const storedUserData = localStorage.getItem('userData');
    
    if (storedUserData) {
      setUser(JSON.parse(storedUserData));
      setLoading(false);
      return;
    }

    if (!merchantId && !storedMerchantId) {
      setLoading(false);
      setError('Please log in to view your dashboard.');
      return;
    }

    const id = merchantId || storedMerchantId;

    try {
      const response = await axios.get(`${BASE_URL}/merchants/${id}`);
      const merchantData = response.data;
      setUser(merchantData);
      localStorage.setItem('userData', JSON.stringify(merchantData));
      setError(null);
    } catch (err) {
      console.error('Error fetching merchant data:', err);
      if (storedUserData) {
        console.log('Using stored user data as fallback');
        setUser(JSON.parse(storedUserData));
      } else {
        setError('Unable to load merchant data. Please try logging in again.');
      }
    } finally {
      setLoading(false);
    }
  }, [merchantId, setUser]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/categories?merchant_id=${merchantId}`);
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  }, [merchantId]);

  const fetchProducts = useCallback(async (categoryId = '') => {
    try {
      const url = `${BASE_URL}/products?merchant_id=${merchantId}${categoryId ? `&category_id=${categoryId}` : ''}`;
      const response = await axios.get(url);
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  }, [merchantId]);

  const fetchStats = useCallback(async () => {
    try {
      // Get both API products and sample products
      const productsResponse = await fetch(`${BASE_URL}/products?merchant_id=${merchantId}`);
      const apiProducts = await productsResponse.json();
      
      // Get sample products from context/localStorage
      const storedProducts = localStorage.getItem('products');
      const sampleProducts = storedProducts ? JSON.parse(storedProducts) : [];
      
      // Combine all products
      const allProducts = [...(Array.isArray(apiProducts) ? apiProducts : []), ...sampleProducts];

      let totalLikes = 0;
      let totalReviews = 0;
      let totalRatingValue = 0;
      let totalRatingCount = 0;
      let totalSales = 0;

      // Process all products in parallel
      const statsPromises = allProducts.map(async (product) => {
        try {
          // For API products, fetch from backend
          if (product.merchant_id === merchantId) {
            const [likesRes, reviewsRes, ratingsRes] = await Promise.all([
              fetch(`${BASE_URL}/likes?product_id=${product.id}`),
              fetch(`${BASE_URL}/reviews?product_id=${product.id}`),
              fetch(`${BASE_URL}/ratings?product_id=${product.id}`)
            ]);

            const [likesData, reviewsData, ratingsData] = await Promise.all([
              likesRes.json(),
              reviewsRes.json(),
              ratingsRes.json()
            ]);

            return {
              likes: Array.isArray(likesData) ? likesData.length : 0,
              reviews: Array.isArray(reviewsData) ? reviewsData.length : 0,
              ratings: Array.isArray(ratingsData) ? ratingsData : [],
              sales: product.sales || 0
            };
          } 
          // For sample products, use their built-in stats
          else {
            return {
              likes: product.likes || 0,
              reviews: product.reviews || 0,
              ratings: [{ value: product.rating || 0 }],
              sales: product.sales || 0
            };
          }
        } catch (error) {
          console.error(`Error fetching stats for product ${product.id}:`, error);
          return { likes: 0, reviews: 0, ratings: [], sales: 0 };
        }
      });

      const statsResults = await Promise.all(statsPromises);

      // Calculate totals
      statsResults.forEach(stat => {
        totalLikes += stat.likes;
        totalReviews += stat.reviews;
        totalSales += stat.sales;
        
        if (stat.ratings.length > 0) {
          const ratingSum = stat.ratings.reduce((acc, rating) => acc + (rating.value || 0), 0);
          totalRatingValue += ratingSum;
          totalRatingCount += stat.ratings.length;
        }
      });

      // Update state with calculated totals
      setLikes(totalLikes);
      setReviews(totalReviews);
      setSales(totalSales);
      setUsers(statsResults.length); // Number of products as a metric
      setRating(totalRatingCount > 0 ? totalRatingValue / totalRatingCount : 0);

    } catch (error) {
      console.error('Error fetching stats:', error);
      setLikes(0);
      setReviews(0);
      setSales(0);
      setUsers(0);
      setRating(0);
    }
  }, [merchantId]);

  useEffect(() => {
    fetchMerchantData();
  }, [fetchMerchantData]);

  useEffect(() => {
    if (merchantId) {
      fetchCategories();
      // Combine sample products with API products
      setProducts(prevProducts => {
        const combinedProducts = [...sampleProducts, ...(Array.isArray(prevProducts) ? prevProducts : [])];
        // Remove duplicates based on product ID
        const uniqueProducts = Array.from(new Map(
          combinedProducts.map(product => [product.id, product])
        ).values());
        return uniqueProducts;
      });
    }
  }, [merchantId, fetchCategories]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleProductCreated = useCallback((newProduct) => {
    console.log('New product created:', newProduct);
    setProducts(prevProducts => [...prevProducts, newProduct]);
    setActiveSection('viewProducts');
  }, [setProducts]);

  const handleCategoryFilter = useCallback((categoryId) => {
    fetchProducts(categoryId);
  }, [fetchProducts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser({ ...updatedUser, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`${BASE_URL}/merchants/${merchantId}`, updatedUser);
      setUser(response.data);
      setEditMode(false);
      console.log('Merchant data updated successfully');
    } catch (error) {
      console.error('Error updating merchant data:', error);
      setError('Failed to update merchant data. Please try again.');
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setUpdatedUser(user);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
    setDropdownOpen(false); // Close the dropdown after clicking
  };

  const togglePasswordModal = () => {
    setShowPasswordModal(!showPasswordModal);
    setDropdownOpen(false);
    setPasswordError(null);
    setPasswordData({ old_password: '', new_password: '' });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handlePasswordUpdate = async () => {
    try {
      await axios.put(`${BASE_URL}/merchants/${merchantId}/change-passwd`, passwordData);
      console.log('Password updated successfully');
      setShowPasswordModal(false);
      setPasswordError(null);
    } catch (error) {
      console.error('Error updating password:', error);
      setPasswordError('Failed to update password. Please try again.');
    }
  };

  const trimUrl = (url, maxLength = 30) => {
    if (!url) return '';
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength - 3) + '...';
  };

  const handleLogout = () => {
    // Clear user data from context
    setUser(null);
    setMerchantId(null);

    // Clear local storage
    localStorage.removeItem('userData');
    localStorage.removeItem('merchantId');

    // Navigate to admin login page
    navigate('/adminLogin');
  };

  const toggleCategoryManager = () => {
    setActiveSection('categoryManager');
    setShowProfile(false);
    setDropdownOpen(false);
  };

  const toggleCreateProduct = () => {
    setActiveSection('createProduct');
    setShowProfile(false);
    setDropdownOpen(false);
  };

  const toggleViewProducts = () => {
    setActiveSection('viewProducts');
    setShowProfile(false);
    setShowCreateProduct(false);
    setShowCategoryManager(false);
    setDropdownOpen(false);
    fetchProducts(); // This will now fetch products for the current merchant
  };

  const goToMainDashboard = () => {
    setActiveSection('main');
  };

  const fetchProductDetails = async (productId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/products/${productId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product details');
      }
      const productData = await response.json();
      setSelectedProduct(productData);

      // Fetch liked users for this product
      const likedUsersData = await getLikedUsers(productId);
      setLikedUsers(likedUsersData);

      setShowProductModal(true);
    } catch (error) {
      console.error('Error fetching product details:', error);
      setError('Failed to fetch product details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setSelectedProduct(null);
  };

  const trimProductName = (name, maxLength = 35) => {
    if (!name) return '';
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength - 3) + '...';
  };

  if (loading) return <div className="spinner mx-auto mt-10">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!user) return <div className="error-message">No user data available. Please log in.</div>;

  return (
    <div className="dashboard-container bg-gray-100 min-h-screen flex">
      {/* Sidebar */}
      <div className={`bg-gray-800 text-white w-64 min-h-screen fixed top-0 left-0 z-20 transition-transform duration-300 ease-in-out transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Menu</h2>
          <button onClick={toggleSidebar} className="text-white md:hidden">
            <FaTimes className="text-xl" />
          </button>
        </div>
        <nav className="mt-4">
          <button
            onClick={toggleCreateProduct}
            className="w-full text-left py-2 px-4 hover:bg-gray-700 flex items-center"
          >
            <FaBox className="mr-2" /> Create Product
          </button>
          <button
            onClick={toggleViewProducts}
            className="w-full text-left py-2 px-4 hover:bg-gray-700 flex items-center"
          >
            <FaEye className="mr-2" /> View Products
          </button>
          <button
            onClick={toggleCategoryManager}
            className="w-full text-left py-2 px-4 hover:bg-gray-700 flex items-center"
          >
            <FaList className="mr-2" /> Manage Categories
          </button>
          {/* Add the logout button here */}
          <button
            onClick={handleLogout}
            className="w-full text-left py-2 px-4 hover:bg-gray-700 flex items-center text-red-400 hover:text-red-300"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 md:ml-64">
        <nav className="bg-white shadow-md p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <button onClick={toggleSidebar} className="mr-4 md:hidden">
                {sidebarOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
              </button>
              <h1 className="text-2xl font-bold text-gray-800">Merchant Dashboard</h1>
            </div>
            <div className="relative flex items-center gap-2" ref={dropdownRef}>
              <h1>{user.first_name}</h1>
              <p>|</p>
              <button
                onClick={toggleDropdown}
                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                <FaUser className="text-xl" />
              </button>
              {dropdownOpen && (
                <div className="absolute top-10 right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                  <button
                    onClick={toggleProfile}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <FaUser className="mr-2" /> View/Edit Profile
                  </button>
                  <button onClick={togglePasswordModal} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                    <FaLock className="mr-2" /> Update Password
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        <div className="container mx-auto mt-8 p-4">
          {activeSection !== 'main' && (
            <button
              onClick={goToMainDashboard}
              className="mb-4 text-slate-500 px-4 py-2 rounded hover:bg-gray-200 flex items-center"
            >
              <FaArrowLeft className="mr-2" /> Back to Dashboard
            </button>
          )}

          {activeSection === 'main' && !showProfile && (
            <>
              <h2 className="text-xl font-semibold mb-4">Welcome, {user.first_name}!</h2>
              
              {/* Stats Section */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <div className="bg-blue-100 p-4 rounded-lg text-center">
                  <FaHeart className="text-red-500 text-2xl mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Likes</p>
                  <p className="text-lg font-bold">{likes}</p>
                </div>
                <div className="bg-green-100 p-4 rounded-lg text-center">
                  <FaStar className="text-yellow-500 text-2xl mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Reviews</p>
                  <p className="text-lg font-bold">{reviews}</p>
                </div>
                <div className="bg-purple-100 p-4 rounded-lg text-center">
                  <FaShoppingCart className="text-purple-500 text-2xl mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Sales</p>
                  <p className="text-lg font-bold">{sales}</p>
                </div>
                <div className="bg-yellow-100 p-4 rounded-lg text-center">
                  <FaUsers className="text-blue-500 text-2xl mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Users</p>
                  <p className="text-lg font-bold">{users}</p>
                </div>
                <div className="bg-red-100 p-4 rounded-lg text-center">
                  <FaStar className="text-orange-500 text-2xl mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Rating</p>
                  <p className="text-lg font-bold">{rating.toFixed(1)}</p>
                </div>
              </div>

              {/* Categories and Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Categories Container */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Categories</h3>
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                      {categories?.length || 0} total
                    </span>
                  </div>
                  
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {categories && categories.length > 0 ? (
                      categories.map((category) => (
                        <div 
                          key={category.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                        >
                          <span className="font-medium">{category.name}</span>
                          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                            {category.products?.length || 0} products
                          </span>
                        </div>
                      ))
                    ) : (
                      <p>No categories available.</p>
                    )}
                  </div>
                </div>

                {/* Products Container */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Products</h3>
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                      {products?.length || 0} total
                    </span>
                  </div>
                  
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {products && products.length > 0 ? (
                      products.map((product) => (
                        <div 
                          key={product.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                        >
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <img 
                              src={Array.isArray(product.images) ? product.images[0] : product.imageUrl} 
                              alt={product.title || product.name} 
                              className="w-12 h-12 object-cover rounded flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <span className="pl-6 font-medium block truncate" title={product.title || product.name}>
                                {trimProductName(product.title || product.name)}
                              </span>
                              <div className="text-sm text-gray-500">
                                USD {product.price.toFixed(2)} • {product.brand}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 flex-shrink-0">
                            <div className="text-sm text-gray-500 whitespace-nowrap">
                              <span className="mr-2">★ {product.rating}</span>
                              <span className="mr-2">♥ {product.likes}</span>
                              <span>↗ {product.sales}</span>
                            </div>
                            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded whitespace-nowrap">
                              {product.stock || 'In Stock'}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No products available.</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSection === 'main' && showProfile && (
            <>
              <button
                onClick={() => setShowProfile(false)}
                className="mb-4 text-slate-500 px-4 py-2 rounded hover:bg-gray-200 flex items-center"
              >
                <FaArrowLeft className="mr-2" /> Back to Dashboard
              </button>
              <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
                <div className="relative h-80 bg-gradient-to-r from-blue-500 to-purple-600">
                  <img
                    src={user.banner || 'https://via.placeholder.com/1500x500'}
                    alt="Profile Banner"
                    className="w-full h-full object-cover opacity-50"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end space-x-6">
                    <img
                      src={user.icon || 'https://via.placeholder.com/150'}
                      alt="Profile Icon"
                      className="w-40 h-40 rounded-full border-4 object-contain border-white shadow-xl"
                    />
                    <div>
                      <h2 className="text-4xl font-bold text-white shadow-text mb-2">{user.store_name}</h2>
                      <p className="text-xl text-white shadow-text">{user.descp}</p>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  {editMode ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input
                        name="first_name"
                        defaultValue={user.first_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200"
                        placeholder="First Name"
                      />
                      <input
                        name="last_name"
                        defaultValue={user.last_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200"
                        placeholder="Last Name"
                      />
                      <input
                        name="email"
                        defaultValue={user.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200"
                        placeholder="Email"
                      />
                      <input
                        name="phone"
                        defaultValue={user.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200"
                        placeholder="Phone"
                      />
                      <input
                        name="store_name"
                        defaultValue={user.store_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200"
                        placeholder="Store Name"
                      />
                      <textarea
                        name="descp"
                        defaultValue={user.descp}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200"
                        placeholder="Description"
                        rows="3"
                      />
                      <input
                        name="icon"
                        defaultValue={user.icon}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200"
                        placeholder="Icon URL"
                      />
                      <input
                        name="banner"
                        defaultValue={user.banner}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200"
                        placeholder="Banner URL"
                      />
                      <input
                        name="state"
                        defaultValue={user.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200"
                        placeholder="State"
                      />
                      <input
                        name="district"
                        defaultValue={user.district}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200"
                        placeholder="District"
                      />
                      <button
                        onClick={handleUpdate}
                        className="col-span-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out flex items-center justify-center text-lg font-semibold"
                      >
                        <FaSave className="mr-2" /> Save Changes
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                        <FaUser className="text-blue-500 text-2xl" />
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Full Name</p>
                          <p className="text-lg text-gray-800">{user.first_name} {user.last_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                        <FaEnvelope className="text-blue-500 text-2xl" />
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Email</p>
                          <p className="text-lg text-gray-800">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                        <FaPhone className="text-blue-500 text-2xl" />
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Phone</p>
                          <p className="text-lg text-gray-800">{user.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                        <FaMapMarkerAlt className="text-blue-500 text-2xl" />
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Location</p>
                          <p className="text-lg text-gray-800">{user.state}, {user.district}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                        <FaImage className="text-blue-500 text-2xl" />
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Icon URL</p>
                          <p className="text-lg text-gray-800">{trimUrl(user.icon)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                        <FaImage className="text-blue-500 text-2xl" />
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Banner URL</p>
                          <p className="text-lg text-gray-800">{trimUrl(user.banner)}</p>
                        </div>
                      </div>
                      <button
                        onClick={toggleEditMode}
                        className="col-span-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out flex items-center justify-center text-lg font-semibold"
                      >
                        <FaEdit className="mr-2" /> Edit Profile
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeSection === 'createProduct' && (
            <CreateProduct onProductCreated={handleProductCreated} />
          )}

          {activeSection === 'viewProducts' && (
            <ViewProducts 
              products={products} 
              categories={categories}
              onCategoryFilter={handleCategoryFilter}
            />
          )}

          {activeSection === 'categoryManager' && (
            <CategoryManager />
          )}
        </div>

        {/* Password Update Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
              <h2 className="text-2xl font-bold mb-4">Update Password</h2>
              {passwordError && <p className="text-red-500 mb-4">{passwordError}</p>}
              <input
                type="password"
                name="old_password"
                value={passwordData.old_password}
                onChange={handlePasswordChange}
                placeholder="Old Password"
                className="w-full mb-4 p-2 border rounded"
              />
              <input
                type="password"
                name="new_password"
                value={passwordData.new_password}
                onChange={handlePasswordChange}
                placeholder="New Password"
                className="w-full mb-4 p-2 border rounded"
              />
              <div className="flex justify-end">
                <button
                  onClick={togglePasswordModal}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordUpdate}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Details Modal */}
        {showProductModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{selectedProduct.title}</h2>
                <button onClick={closeProductModal} className="text-gray-500 hover:text-gray-700">
                  <FaTimes className="text-xl" />
                </button>
              </div>
              <img 
                src={selectedProduct.images && selectedProduct.images.length > 0 ? selectedProduct.images[0] : 'placeholder-image-url'} 
                alt={selectedProduct.title} 
                className="w-full h-64 object-cover mb-4 rounded" 
              />
              <p className="text-gray-600 mb-2">{selectedProduct.descp}</p>
              <p className="text-blue-600 font-bold mb-2">{selectedProduct.price} {selectedProduct.currency}</p>
              <p className="text-gray-600 mb-2">Category: {selectedProduct.category_name}</p>
              <p className="text-gray-600 mb-2">Stock: {selectedProduct.stock}</p>
              {/* Add more product details as needed */}
              
              {/* Liked Users Section */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Liked by:</h3>
                {likedUsers.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {likedUsers.map((user, index) => (
                      <li key={index}>{user.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No likes yet.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
