import { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { DashboardContext } from '../context/DashboardContext';
import chatImage from '../images/chat.png';
import axios from 'axios';
import { LikeContext } from '../context/LikeContext';
import { FaHeart } from 'react-icons/fa';
import { IoIosArrowDown } from "react-icons/io";
import ProductCard from '../ProductCard';
import sampleImage from '../images/shoes/26926226_fpx.webp';

const BASE_URL = 'http://ecommerce.reworkstaging.name.ng/v2';

const ProductDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { getProduct, updateProduct, formatProduct } = useContext(DashboardContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  
  // State for collapsible sections
  const [isProductDetailsVisible, setIsProductDetailsVisible] = useState(true);
  const [isShippingReturnsVisible, setIsShippingReturnsVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const { likedProducts, toggleLike } = useContext(LikeContext);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        let productData;
        if (location.state && location.state.product) {
          productData = location.state.product;
        } else {
          productData = getProduct(id);
          if (!productData) {
            // Fallback to API call if not found in context
            const response = await axios.get(`${BASE_URL}/products/${id}`);
            productData = response.data;
          }
        }
        
        // Format the product data
        const formattedProduct = formatProduct(productData);
        setProduct(formattedProduct);
        setSelectedImage(formattedProduct.images[0]);
        setLoading(false);
      } catch (err) {
        setError('Error fetching product details');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, location.state, getProduct, formatProduct]);

  const handleProductUpdate = async (updatedData) => {
    try {
      const formattedProduct = formatProduct({
        ...product,
        ...updatedData
      });
      await updateProduct(formattedProduct);
      setProduct(formattedProduct);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert("Please select a size before adding to the cart.");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) {
        alert("Please log in to add items to cart");
        return;
      }

      const cartItem = {
        id: parseInt(id),
        name: product.name,
        price: product.price,
        images: product.images,
        selectedSize,
        quantity: 1
      };

      await addToCart(cartItem);
      alert('Product added to cart successfully!');
      navigate('/cart');
    } catch (error) {
      console.error('Error adding item to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  const handleLike = () => {
    toggleLike(id);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div className="container mx-auto p-6 pt-10">
      <div className="flex flex-col md:flex-row">
        {/* Product Image Section */}
        <div className="md:w-1/2">
          <div className="relative flex">
            
            {/* Thumbnail Images */}
            <div className="flex space-x-2 mt-4 overflow-x-hidden flex-col items-center">
              {product.images && product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Product ${index}`}
                  onClick={() => setSelectedImage(img)}
                  className="w-[90px] h-[90px] cursor-pointer object-contain hover:border-gray-500 rounded"
                />
              ))}
              <div className="flex flex-col mt-6">
                <button className='bg-white bg-opacity-75 p-2 rounded-full'>
                  <IoIosArrowDown className='text-2xl' />
                </button>
              </div>
            </div>

            <img
              src={selectedImage || product.imageUrl || product.images[0]}
              alt={product.name}
              className="ml-28 w-[35rem] h-auto object-cover rounded-lg"
            />
            <button
              onClick={handleLike}
              className="absolute top-2 right-2 bg-white bg-opacity-75 p-2 rounded-full"
            >
              <FaHeart className={`text-3xl ${likedProducts[id] ? 'text-red-500' : 'text-gray-400'}`} />
            </button>
            
          </div>
        </div>

        {/* Product Information Section */}
        <div className="md:w-1/2 md:pl-10 mt-6 md:mt-0">
          <h1 className="text-[15px] text-left font-semibold mb-2">{product.brand || 'Nike'}</h1>
          <h1 className="text-[22px] text-left font-bold mb-6 w-[600px]">{product.name}</h1>
          <h1 className="text-[20px] text-left font-semibold">CLEARANCE</h1>
          <div className="flex items-left items-center mb-4">
            <span className="text-xl text-left font-bold text-red-600">USD {product.price}.00</span>
            {product.oldPrice && (
              <span className="text-gray-500 text-xl font-semibold line-through ml-2">USD {product.oldPrice}.00</span>
            )}&nbsp;
            <span className="underline text-gray-500 text-[12px]">Details</span>
          </div>
          <div className="flex items-center mb-4 mt-10">
            <h1 className="text-[16px] text-left font-semibold uppercase">Color: {product.color || 'Neutral'}</h1>
          </div>

          {/* Sizes */}
          <div className="mb-4 mt-10">
            <div className="flex text-[15px] items-end justify-between w-[560px]">
              <h3 className="text-left font-bold">SIZE: <span className='font-bold'>{selectedSize ? selectedSize : 'Please select'}</span></h3>
              <h3 className="text-right text-[12px] underline underline-offset-[3px] text-gray-500">Size Chart</h3>
            </div>
            <div className="flex mt-4 flex-wrap max-w-[560px] gap-6 gap-y-5">
              <SizeButton size="6" selectedSize={selectedSize} onSelect={handleSizeSelect} />
              <SizeButton size="6.5" selectedSize={selectedSize} onSelect={handleSizeSelect} />
              <SizeButton size="7" selectedSize={selectedSize} onSelect={handleSizeSelect} />
              <SizeButton size="7.5" selectedSize={selectedSize} onSelect={handleSizeSelect} />
              <SizeButton size="8" selectedSize={selectedSize} onSelect={handleSizeSelect} />
              <SizeButton size="8.5" selectedSize={selectedSize} onSelect={handleSizeSelect} />
              <SizeButton size="9" selectedSize={selectedSize} onSelect={handleSizeSelect} />
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="bg-red-800 text-white font-semibold flex justify-center px-6 py-4 w-[560px] shadow hover:bg-red-700 transition"
          >
            Add To Bag
          </button>
          <hr className='w-[560px] border-zinc-300 mt-8' />

          {/* Collapsible Product Details Section */}
          <div className="py-2 border-b border-b-zinc-400 w-[560px]">
            <div className='flex items-center justify-between w-[560px] cursor-pointer' onClick={() => setIsProductDetailsVisible(!isProductDetailsVisible)}>
              <h2 className="text-[15px] text-left font-bold my-4">Product Details</h2>
              <p className='font-bold text-2xl transition-transform duration-300'>{isProductDetailsVisible ? '-' : '+'}</p>
            </div>
            <div className={`overflow-hidden transition-all duration-300 ${isProductDetailsVisible ? 'max-h-screen' : 'max-h-0'}`}>
              {isProductDetailsVisible && (
                <ul className="list-disc list-inside text-left text-gray-700 space-y-1">
                  <li className='list-none'>The past and present find perfect balance in this pair of Nike Women's V2K <br /> 
                      Run Running Sneakers. Fine-tuning the design of the vintage-like Vomero 5 <br /> 
                      for the future, this shoe is a soon-to-be sensation of its own with its heritage <br /> 
                      plastic and polished, modern metallic accents. A dual-density midsole and <br /> 
                      chunky heel render this retro remodel an immeasurably comfortable instant <br /> 
                      classic.</li>
                  <br />
                  <li>Low-profile road running sneaker</li>
                  <li>Upgraded breathable engineered mesh upper</li>
                  <li>Cushioned collar, tongue, and sockliner for ultimate comfort</li>
                  <li>Lightweight engineered mesh upper is durable and well ventilated</li>
                  <li>Redesigned midfoot strap for ease of accessibility and embracive fit</li>
                  <li>Nike ReactX foam and dual-unit Zoom Air cushioning for a relaxed <br /> &nbsp;&nbsp;&nbsp;&nbsp; and ultra-responsive run experience</li>
                  <li>Waffle-patterned rubber outsole with modified heel for guaranteed <br /> &nbsp;&nbsp;&nbsp;&nbsp; gripping power and seamless shifts from heel-to-toe</li>
                  <li>Style no. FD2723</li>
                  <li>Synthetic upper; Rubber sole</li>
                  <li>Women's athletic footwear from Finish Line</li>
                  <li>Imported</li>
                  <br />
                  <li className='mb-4 list-none'>Web ID: 19450761</li>
                </ul>
              )}
            </div>
          </div>

          {/* Collapsible Shipping and Returns Section */}
          <div className="py-2 border-b border-b-zinc-400 w-[560px]">
            <div className='flex items-center justify-between w-[560px] cursor-pointer' onClick={() => setIsShippingReturnsVisible(!isShippingReturnsVisible)}>
              <h2 className="text-[15px] text-left font-bold my-4">Shipping and Returns</h2>
              <p className='font-bold text-2xl transition-transform duration-300'>{isShippingReturnsVisible ? '-' : '+'}</p>
            </div>
            <div className={`overflow-hidden transition-all duration-300 ${isShippingReturnsVisible ? 'max-h-screen' : 'max-h-0'}`}>
              {isShippingReturnsVisible && (
                <ul className="list-disc list-inside text-left text-gray-700 space-y-1">
                  <li>Select items are excluded from international shipping <span className='underline cursor-pointer'>exclusions & details</span> </li>
                  <li>Free shipping applies to domestic leg only, additional shipping fees <br /> 
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;and duties may apply at checkout.</li>
                  <li>This item may not be shipped to Marshall Islands, Puerto Rico, U.S. <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Virgin Islands, Armed Forces Americas, Northern Mariana, Armed Forces <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Europe, Palau, Alaska, American Samoa, Guam, Armed Forces Pacific <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;and El Paso, Texas.</li>
                  <li>Enjoy a longer window to return most of your holiday purchases. See our <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Extended Holiday Return Policy to see if this item qualifies.</li>
                  <li>California customers call 1-800-289-6229 for Free Shipping information.</li>
                  <li>For complete details, see our <span className='underline cursor-pointer'>Shipping</span> and <span className='underline cursor-pointer'>Returns</span> policies.</li>
                </ul>
              )}
            </div>
          </div>

          {/* Chat with a style expert Section */}
          <div className="py-2 w-[560px]">
            <div className='flex items-center justify-between w-[560px]'>
              <h2 className="text-[15px] text-left font-bold my-4">Chat with a style expert</h2>
            </div>
            <div>
              <ul className="list-disc list-inside text-left text-gray-700">
                <li className='list-none text-[13px]'>Our experts can answer any questions you have about this item, or help you find something new.</li>
                <br />
                <li className='flex gap-1 items-center cursor-pointer'><img src={chatImage} alt="Chat with a style expert" /><span className='underline underline-offset-2 cursor-pointer font-medium text-[15px] hover:text-gray-500'>Chat Now</span></li>
              </ul>
            </div>
          </div>

        </div>
      </div>

      {/* Shop similar styles */}
      <div className="mt-10">
        <h2 className="text-2xl text-left font-bold mb-4">Shop similar styles</h2>
        <div className="mt-16 w-[40%] grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.slice(0, 2).map((product) => (
            <div key={product.id} className="relative p-4 rounded-lg hover:shadow-lg transition-shadow duration-300 group">
              <Link to={`/product/${product.id}`} className="block">
                <div className="relative overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-auto rounded-lg mb-2"
                  />
                  <button 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-75 text-gray-700 rounded-full p-2 hover:bg-opacity-100 transition-all duration-300 opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Remove product from the similar styles list
                      setProducts(prevProducts => {
                        return prevProducts.filter(p => p.id !== product.id);
                      });
                      console.log(`Removed product ${product.id} from similar styles`);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <h3 className="text-sm font-semibold truncate">{product.name}</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold text-red-600">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.oldPrice && (
                    <span className="text-gray-500 line-through text-sm">
                      ${product.oldPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center">
                  <span className="text-black mr-1">
                    {[...Array(5)].map((_, i) => {
                      if (i < Math.floor(product.rating)) {
                        return <span key={i}>★</span>;
                      } else if (i === Math.floor(product.rating) && product.rating % 1 !== 0) {
                        return <span key={i} style={{ position: 'relative', display: 'inline-block' }}>
                          <span style={{ position: 'absolute', width: '50%', overflow: 'hidden' }}>★</span>
                          <span>☆</span>
                        </span>;
                      } else {
                        return <span key={i}>☆</span>;
                      }
                    })}
                  </span>
                  <span className="text-gray-500 text-xs">({product.reviews})</span>
                </div>
              </Link>
            </div>
          ))} 
        </div>
      </div>
    </div>
  );
};

const SizeButton = ({ size, selectedSize, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(size)}
      className={`border ${selectedSize === size ? 'border-[3px] border-black' : 'border-black'} rounded-md px-7 py-4 transition ${
        selectedSize === size ? 'bg-gray-100 text-black' : 'bg-white text-black'
      }`}
    >
      {size}
    </button>
  );
};

export default ProductDetail;
