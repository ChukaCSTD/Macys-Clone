import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import ProductCard from '../ProductCard';
import { DashboardContext } from '../context/DashboardContext';
import { GoHome } from "react-icons/go";
import { PiSlidersHorizontal } from "react-icons/pi";
import { Link, useParams } from 'react-router-dom';
import Shoe1 from '../images/shoes/26926238_fpx.webp'
import Shoe1_1 from '../images/shoes/26926226_fpx.webp'
import Shoe1_2 from '../images/shoes/26926228_fpx.webp'
import Shoe1_3 from '../images/shoes/26926229_fpx.webp'
import Shoe1_4 from '../images/shoes/26926231_fpx.webp'
import Shoe1_5 from '../images/shoes/26926232_fpx.webp'
import Shoe2 from '../images/shoes/29156443_fpx.webp'
import Shoe2_1 from '../images/shoes/29156434_fpx.webp'
import Shoe2_2 from '../images/shoes/29156436_fpx.webp'
import Shoe2_3 from '../images/shoes/29156437_fpx.webp'
import Shoe2_4 from '../images/shoes/29156439_fpx.webp'
import Shoe2_5 from '../images/shoes/29156442_fpx.webp'
import Shoe3 from '../images/shoes/29519995_fpx.webp'
import Shoe3_1 from '../images/shoes/29519996_fpx.webp'
import Shoe3_2 from '../images/shoes/29519997_fpx.webp'
import Shoe3_3 from '../images/shoes/29519998_fpx.webp'
import Shoe3_4 from '../images/shoes/29519999_fpx.webp'
import Shoe3_5 from '../images/shoes/29520001_fpx.webp'
import Shoe4 from '../images/shoes/29116166_fpx.webp'
import Shoe4_1 from '../images/shoes/29116160_fpx.webp'
import Shoe4_2 from '../images/shoes/29116161_fpx.webp'
import Shoe4_3 from '../images/shoes/29116162_fpx.webp'
import Shoe4_4 from '../images/shoes/29116163_fpx.webp'
import Shoe4_5 from '../images/shoes/29116164_fpx.webp'

const BASE_URL = 'http://ecommerce.reworkstaging.name.ng/v2';

const ProductPage = () => {
  const { products, setProducts, formatProduct, merchantId } = useContext(DashboardContext);
  const [apiProducts, setApiProducts] = useState([]);

  const sampleProducts = [
    {
      id: 1,
      name: "Women's Free Metcon 6 Training Sneakers from Finish Line",
      price: 150.00,
      oldPrice: 180.00,
      imageUrl: Shoe1,
      images: [Shoe1, Shoe1_1, Shoe1_2, Shoe1_3, Shoe1_4, Shoe1_5],
      rating: 4.5,
      reviews: 60,
      color: "White/Black",
      brand: "Nike",
      likes: 45,
      sales: 30,
    },
    {
      id: 2,
      name: "Women's Pegasus 41 Running Sneakers from Finish Line",
      price: 160.00,
      imageUrl: Shoe2,
      images: [Shoe2, Shoe2_1, Shoe2_2, Shoe2_3, Shoe2_4, Shoe2_5],
      rating: 4.7,
      reviews: 133,
      color: "Brown/White",
      brand: "Nike",
      likes: 67,
      sales: 45,
    },
    {
      id: 3,
      name: "Women's V2K Run Running Sneakers from Finish Line",
      price: 120.00,
      oldPrice: 140.00,
      imageUrl: Shoe3,
      images: [Shoe3, Shoe3_1, Shoe3_2, Shoe3_3, Shoe3_4, Shoe3_5],
      rating: 3,
      reviews: 8,
      color: "Black/White",
      brand: "Nike",
      likes: 12,
      sales: 8,
    },
    {
      id: 4,
      name: "Women's React Infinity Run Flyknit 4 Running Sneakers from Finish Line",
      price: 100.00,
      imageUrl: Shoe4,
      images: [Shoe4, Shoe4_1, Shoe4_2, Shoe4_3, Shoe4_4, Shoe4_5],
      rating: 4.0,
      reviews: 150,
      color: "Gray/Pink",
      brand: "Nike",
      likes: 89,
      sales: 55,
    }
  ];

  useEffect(() => {
    // Set sample products as before
    setProducts(sampleProducts);
    localStorage.setItem('products', JSON.stringify(sampleProducts));

    // Add API products fetch
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/products?merchantId=${merchantId}`);
        if (response.data && response.data.length > 0) {
          // Format all products from API
          const formattedProducts = response.data.map(product => formatProduct(product));
          setApiProducts(formattedProducts);
          
          // Update products in context
          setProducts(prevProducts => {
            const combinedProducts = [...prevProducts, ...formattedProducts];
            // Remove duplicates based on product ID
            const uniqueProducts = Array.from(new Map(
              combinedProducts.map(product => [product.id, product])
            ).values());
            return uniqueProducts;
          });
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [setProducts, formatProduct, merchantId]);

  // Combine sample and API products in the render
  const allProducts = [...sampleProducts, ...apiProducts];

  return (
    <div className="container p-6 w-[97vw]">
      {/* Breadcrumb */}
      <nav className="text-sm text-left text-gray-500 flex gap-1">
        <a href="/" className="hover:underline flex gap-1"><GoHome className='m-auto font-bold' /></a> {'>'} 
        <a href="/brands" className="hover:underline">Brands</a> {'>'} 
        <a href="/nike" className="hover:underline">Nike</a> {'>'} 
        <span className="text-gray-700">Nike Women's Shoes</span>
      </nav>

      {/* Title and Filters */}
      <div className="flex justify-between items-center mt-6">
        <h1 className="text-2xl font-bold">Nike Women's Shoes (4)</h1>
        
      </div>

      {/* Sort Dropdown */}
      <div className="flex justify-between mt-4 w-[95vw]">

      <div className="flex space-x-3">
          <button className="px-4 py-3 border border-black rounded flex items-center gap-2"><PiSlidersHorizontal/> All Filters</button>
          <button className="px-4 py-3 border border-black rounded">Size</button>
          <button className="px-4 py-3 border border-black rounded">Color</button>
          <button className="px-4 py-3 border border-black rounded">Sport & Activity</button>
          <button className="px-4 py-3 border border-black rounded">Item Type</button>
          <button className="px-4 py-3 border border-black rounded">Sneaker Style</button>
          <button className="px-4 py-3 border border-black rounded">Price</button>
        </div>


        {/* <label htmlFor="sort" className="mr-2">Sort by:</label> */}
        <select id="sort" className="px-4 py-2 border border-gray-300 rounded">
          <option>Featured Items</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Best Sellers</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="w-[95vw] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {allProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={{
              ...product,
              // Ensure consistent property names
              name: product.title || product.name,
              imageUrl: product.images || product.imageUrl,
              description: product.descp || product.description
            }} 
          />
        ))}
      </div>

      <hr className='mx-auto w-[100rem]'/>
      
      {/* Our top deals & picks */}
      <div>
        <h1 className='mt-4 text-left text-2xl font-bold'>
        Our top deals & picks
        </h1>
        <div className="mt-16 w-[40%] grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.slice(0, 2).map((product) => (
            <div key={product.id} className="relative p-4 rounded-lg  hover:shadow-lg transition-shadow duration-300 group">
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
                      // Remove product from the top deals & picks list
                      setProducts(prevProducts => {
                        return prevProducts.filter(p => p.id !== product.id);
                      });
                      console.log(`Removed product ${product.id} from top deals & picks`);
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
                    USD {product.price.toFixed(2)}
                  </span>
                  {product.oldPrice && (
                    <span className="text-gray-500 line-through text-sm">
                      USD {product.oldPrice.toFixed(2)}
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

      {/* Nike Women’s Shoes & Sneakers */}
      <div className='text-left'>
        <br />
        <h1 className='mt-4 text-left text-2xl font-bold'>Nike Women's Shoes & Sneakers</h1>
          <br />
        <p className='text-[13px] w-screen'>When you're shopping for women's sneakers, head to Macy's. That's where you'll find the brands you love best, like Nike. We carry everything from Nike women's hoodies to women's basketball shoes, with styles and sizes for everybody. Why choose Nike women's shoes? <br /> Because they offer the total package: innovative performance features and collector-worthy style, all in one. Here's what you need to know.</p>
        <br />
        <p className='text-[13px] font-bold w-screen'>Nike Shoes for Every Sport</p>
        <p className='text-[13px] w-screen'>Are you searching for sport-specific shoes or looking for all-purpose trainers you can wear to the gym? You'll find both kinds at Macy's. When it comes to Nike running shoes for women, both workhorses (like the Pegasus) and race-day picks (like the Vaporfly) receive <br /> high marks for their cushioned, ultra-comfortable rides. Nike tennis shoes for women allow for quick stops and directional changes on the court with the right amount of traction. Other women's Nike sneakers address specific needs, from tennis to skateboarding, plus <br /> shoes suitable for gym workouts and all-around training.</p>
        <br />
        <p className='text-[13px] font-bold w-screen'>Versatile Lifestyle Sneaker Looks</p>
        <p className='text-[13px] w-screen'>Once practice is over or you've completed your workout, slip into a pair of Nike lifestyle sneakers to make any outfit pop, like Air Force 1 and Air Max styles. These classic kicks are instant look-makers; wear them to upgrade all kinds of clothes, from Nike sweatpants & <br /> leggings to flirty dresses. Every “best of” list should include the Blazer, Cortez, Jordan, and Nike Dunk styles. You can pair them with women's Nike clothes for a branded outfit, too. Though Nike is known for bold color combinations, wardrobe staples like womens white <br /> Nike shoes go with everything. Women's black Nike shoes have a dedicated fan base, too.</p>
        <br />
        <p className='text-[13px] w-screen'>Find Nike shoes for women, Nike men's clothing, and everything you need to sprint, strength-train, and strut your stuff at Macy's.</p>

      </div>
    </div>
  );
};

export default ProductPage;
