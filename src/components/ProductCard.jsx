import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from './context/CartContext';
import { LikeContext } from './context/LikeContext';
import { DashboardContext } from './context/DashboardContext';
import { FaHeart } from 'react-icons/fa';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { likedProducts, toggleLike } = useContext(LikeContext);
  const { formatProduct, updateProduct, deleteProduct } = useContext(DashboardContext);
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showControls, setShowControls] = useState(false);

  const handleLike = (e) => {
    e.preventDefault();
    toggleLike(product.id);
  };

  const handleProductClick = () => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => 
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const previousImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  const handleProductUpdate = async (updatedData) => {
    try {
      const formattedProduct = formatProduct({
        ...product,
        ...updatedData
      });
      await updateProduct(formattedProduct);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleProductDelete = async () => {
    try {
      await deleteProduct(product.id);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div 
      className="product-card p-4 rounded-lg relative"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div onClick={handleProductClick} style={{ cursor: 'pointer' }}>
        <div className="relative">
          {/* Image Carousel */}
          <div className="relative overflow-hidden">
            <img
              src={Array.isArray(product.images) ? product.images[currentImageIndex] : product.imageUrl}
              alt={product.title || product.name}
              className="w-full h-[400px] object-cover transition-opacity duration-500"
            />
            
            {/* Only show controls if there are multiple images */}
            {Array.isArray(product.images) && product.images.length > 1 && showControls && (
              <>
                <button
                  onClick={previousImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 p-2 rounded-full hover:bg-opacity-100 transition-all duration-300"
                >
                  <IoIosArrowBack className="text-2xl" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 p-2 rounded-full hover:bg-opacity-100 transition-all duration-300"
                >
                  <IoIosArrowForward className="text-2xl" />
                </button>
              </>
            )}
          </div>
          
          {/* Like button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLike(e);
            }}
            className="absolute top-2 right-2 z-10 bg-white bg-opacity-75 p-2 rounded-full"
          >
            <FaHeart className={`text-2xl ${likedProducts[product.id] ? 'text-red-500' : 'text-gray-400'}`} />
          </button>
        </div>
      </div>
      
      {/* Product Information */}
      <div className="mt-4">
        <h2 className="text-lg hover:underline text-left font-semibold">{product.brand || 'Nike'}</h2>
        <h2 className="text-lg hover:underline text-left font-semibold">{product.title || product.name}</h2>
        <div className="flex flex-col text-left mt-2">
          {product.has_discount && (
            <span className="text-gray-500 line-through text-sm">
              {product.currency} {(product.price * (1 + product.discount/100)).toFixed(2)}
            </span>
          )}
          <span className="font-bold text-red-600">
            {product.currency} {parseFloat(product.price).toFixed(2)}
          </span>
        </div>
        
        {/* Only show ratings if they exist */}
        {product.rating && (
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
            <span className="text-gray-500 text-xs">({product.reviews || 0})</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
