import React, { useState, useEffect, useRef } from 'react'; 
import Logo from './images/logo.svg'; 
import Search from './images/search.svg'; 
import Cart from './images/cart.svg'; 
import FallShoes from './images/Fall.jpeg'; 

const Navbar = () => {
  const [isShoesDropdownOpen, setShoesDropdownOpen] = useState(false); 
  const shoesRef = useRef(null);

  const toggleShoesDropdown = () => {
    setShoesDropdownOpen(!isShoesDropdownOpen); 
  };

  // useEffect to handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shoesRef.current && !shoesRef.current.contains(event.target)) {
        setShoesDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup the event listener on unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [shoesRef]);

  return (
    <div className='border-b'>
        <nav className='flex justify-between items-center px-8'>
            <img src={Logo} alt="Macys Logo" className='h-10 -mt-4' /> 
            <div className='flex items-center'>
                <div className="text-gray-500 focus-within:text-gray-900 mb-6 -mt-3">
                    <div className="flex relative top-8 items-center pl-3 pointer-events-none">
                        <img src={Search} alt="Search Icon" className='h-6 w-6' /> 
                    </div>
                    <input type="text" placeholder="Search" className='block w-[700px] h-10 pr-5 pl-10 py-2.5 text-base font-normal shadow-xs text-gray-900 bg-transparent border border-gray-500 rounded-full placeholder-gray-400 focus:outline-none' />
                </div>
            </div>
            <img src={Cart} alt="Cart Icon" className='h-7 -mt-4 pr-8' /> 
        </nav>
        <div>
            <ul className='flex justify-around text-[17px] font-bold'>
                <li className='group' style={{ margin: '0 10px', width: '100px' }}>
                    Women
                </li>
                <li className='group' style={{ margin: '0 10px', width: '100px' }}>
                    Men
                </li>
                <li className='group' style={{ margin: '0 10px', width: '100px' }}>
                    Kids & Baby
                </li>
                <li className='group' style={{ margin: '0 10px', width: '100px' }}>
                    Home
                </li>
                <li 
                    className='group hover:underline hover:underline-offset-8 hover:decoration-[3px] h-8 cursor-pointer' 
                    style={{ margin: '0 10px', width: '100px' }}
                    onClick={toggleShoesDropdown}
                    ref={shoesRef} // To make sure the code is referencing the "Shoes" item
                >
                    Shoes
                    {isShoesDropdownOpen && (
                        <div 
                            className='border-t mt-[125px] bg-white shadow-lg p-4 h-auto absolute left-0 right-0 top-16 z-50 w-screen'
                        >
                            <div className='grid grid-cols-5 gap-4 text-[13px]'>
                                <div className='text-black text-left px-6 py-6'>
                                    <ul className='space-y-3'>
                                        <li className='hover:cursor-default text-[16px]'>SHOP VIP DEALS: UP TO 60% OFF</li>
                                        <li className='hover:underline font-normal cursor-pointer'>Extra 30% off with code VIP</li>
                                        <li className='hover:underline font-normal cursor-pointer'>Best Sellers</li>
                                        <li className='hover:underline font-normal cursor-pointer'>Ankle Boots</li>
                                        <li className='hover:underline font-normal cursor-pointer'>Sneakers from adidas & more</li>
                                        <li className='hover:underline font-normal cursor-pointer'>Mary Janes & Flats</li>
                                        <li className='hover:underline font-normal cursor-pointer'>25-50% off Michael Kors</li>
                                        <br />
                                        <li className='hover:cursor-default text-[16px]'>NEW & TRENDING</li>
                                        <li className='hover:underline font-normal cursor-pointer'>New Arrivals</li>
                                        <li className='hover:underline font-normal cursor-pointer'>NEW: Hunter Boots</li>
                                        <li className='hover:underline font-normal cursor-pointer'>Fall Boot Guide: Trends to Know</li>
                                        <li className='hover:underline font-normal cursor-pointer'>Must-Have: Mary Janes</li>
                                    </ul>
                                </div>
                                <div className='text-black text-left px-6 py-6'>
                                    <ul className='space-y-3'>
                                        <li className='hover:cursor-default text-[16px]'>WOMEN'S SHOES</li>
                                        <li className='hover:underline font-normal cursor-pointer'>All Women's Shoes</li>
                                        <li className='hover:underline font-normal cursor-pointer'>Sneakers & Athletic Shoes</li>
                                        <li className='hover:underline font-normal cursor-pointer'>Ankle Boots & Booties</li>
                                        <li className='hover:underline font-normal cursor-pointer'>Boots</li>
                                        <li className='hover:underline font-normal cursor-pointer'>Clogs</li>
                                        <li className='hover:underline font-normal cursor-pointer'>Comfort Shoes</li>
                                        <li className='hover:underline font-normal cursor-pointer'>Flats</li>
                                        <li className='hover:underline font-normal cursor-pointer'>Heels</li>
                                        <li className='hover:underline font-normal cursor-pointer'>Loafers</li>
                                        <li className='hover:underline font-normal cursor-pointer'>Mules & Slides</li>
                                        <li className='hover:underline font-normal cursor-pointer'>Sandals</li>
                                        <li className='hover:underline font-normal cursor-pointer'>Slippers</li>
                                        <li className='hover:underline font-normal cursor-pointer'>Wedding & Bridal</li>
                                        <li className='hover:underline font-normal cursor-pointer'>Wedges</li>
                                    </ul>
                                </div>
                                <div className='text-black text-left px-6 py-6'>
                                    <ul className='space-y-3'>
                                        <li className='hover:cursor-default text-[16px]'>WOMEN'S SHOE BRANDS</li>
                                        <li className='hover:underline font-normal cursor-pointer'>All Shoe Brands</li>
                                        <li className='hover:underline font-normal cursor-pointer'>Clarks</li>
                                        <li className='hover:underline font-normal cursor-pointer'>Franco Sarto</li>
                                        <li className='hover:underline font-normal cursor-pointer'>Naturalizer</li>
                                        <li className='hover:underline font-normal cursor-pointer'><a href="/productPage">Nike</a></li>
                                        <li className='hover:underline font-normal cursor-pointer'>Sam Edelman</li>
                                        <li className='hover:underline font-normal cursor-pointer'>Skechers</li>
                                        <li className='hover:underline font-normal cursor-pointer'>Steve Madden</li>
                                    </ul>
                                </div>
                                <div className='text-black text-left px-6 py-6'>
                                    <ul className='space-y-3'>
                                        <li className='hover:cursor-default text-[16px]'>MEN'S SHOES</li>
                                        <li className='hover:underline font-normal cursor-pointer'>All Men's Shoes</li>
                                        <li className='hover:underline font-normal cursor-pointer'>Athletic Shoes & Sneakers</li>
                                        <li className='hover:underline font-normal cursor-pointer'>Boots</li>
                                        <li className='hover:underline font-normal cursor-pointer'>Casual Shoes</li>
                                        <li className='hover:underline font-normal cursor-pointer'>Dress Shoes</li>
                                        <li className='hover:underline font-normal cursor-pointer'>Loafers & Drivers</li>
                                        <li className='hover:underline font-normal cursor-pointer'>Designer Shoes</li>
                                        <br />
                                        <li className='hover:cursor-default text-[16px]'>KIDS' SHOES</li>
                                        <li className='hover:underline font-normal cursor-pointer'>All Kids' Shoes</li>
                                        <li className='hover:underline font-normal cursor-pointer'>Baby Shoes</li>
                                        <li className='hover:underline font-normal cursor-pointer'>Boys' Shoes</li>
                                        <li className='hover:underline font-normal cursor-pointer'>Girls' Shoes</li>
                                        <br />
                                        <li className='hover:underline font-normal cursor-pointer text-red-600'>Sale & Clearance</li>
                                    </ul>
                                </div>
                                <div className='text-black text-left px-6 py-6'>
                                    <ul className='space-y-3'>
                                        <li className='hover:text-black cursor-pointer'>
                                            <img src={FallShoes} alt="Fall shoes"/>
                                        </li>
                                        <br />
                                        <li className='hover:text-black text-[16px]'>Shop Now</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </li>
                <li className='relative group'>
                    Handbags & Accessories
                </li>
                <li className='relative group'>
                    Jewelry
                </li>
                <li className='relative group text-red-600 mr-5'>
                    Sale
                </li>
            </ul>
        </div>
    </div>
  )
}

export default Navbar;