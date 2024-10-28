import React from 'react';
import nigeriaFlag from './images/nigeria.png';
import X from './images/twitter.svg';
import fb from './images/facebook.svg';
import insta from './images/instagram.svg';
import pint from './images/pinterest.svg';
import yt from './images/youtube.svg';

const Footer = () => {
  return (
    <div>
        <div className='flex justify-around text-left w-full mx-auto p-10 text-white bg-zinc-800 text-[12px]'>
            <div className='w-full'>
                <ul className='space-y-5'>
                    <li className='font-bold text-[14px]'>Customer Service</li>
                    <li className='hover:underline hover:underline-offset-2 hover:cursor-pointer'>Help & FAQs</li>
                    <li className='hover:underline hover:underline-offset-2 hover:cursor-pointer'>Order Tracking</li>
                    <li className='hover:underline hover:underline-offset-2 hover:cursor-pointer'>Shipping & Delivery</li>
                    <li className='hover:underline hover:underline-offset-2 hover:cursor-pointer'>Returns</li>
                    <li className='hover:underline hover:underline-offset-2 hover:cursor-pointer'>Contact Us</li>
                    <li className='flex gap-1 hover:underline hover:underline-offset-2 hover:cursor-pointer'>Shipping To <img src={nigeriaFlag} alt="Nigeria flag" className="w-4 h-4 ml-1 rounded-full" /> Go to U.S. site</li>
                </ul> 
            </div>
            <div className='w-full'>
                <ul className='space-y-5'>
                    <li className='font-bold text-[14px]'>Our Stores</li>
                    <li className='hover:underline hover:underline-offset-2 hover:cursor-pointer'>Find a Store</li>
                    <li className='hover:underline hover:underline-offset-2 hover:cursor-pointer'>Tell Us What You Think</li>
                    <li className='hover:underline hover:underline-offset-2 hover:cursor-pointer'>Macy's Backstage</li>
                    <li className='hover:underline hover:underline-offset-2 hover:cursor-pointer'>Personal Stylist</li>
                </ul>
            </div>
            <div className='w-full'>
                <ul className='space-y-5'>
                    <li className='font-bold text-[14px]'>Macy's Inc.</li>
                    <li className='hover:underline hover:underline-offset-2 hover:cursor-pointer'>Corporate Sites</li>
                    <li className='hover:underline hover:underline-offset-2 hover:cursor-pointer'>About Macy's</li>
                    <li className='hover:underline hover:underline-offset-2 hover:cursor-pointer'>News Room</li>
                    <li className='hover:underline hover:underline-offset-2 hover:cursor-pointer'>Investors</li>
                    <li className='hover:underline hover:underline-offset-2 hover:cursor-pointer'>Macy's Gives</li>
                </ul>
            </div>
            <div className='w-full'>
                <h1 className='font-bold text-[14px]'>Connect With Us</h1>
                <div className='flex gap-5 py-4'>
                    <img src={fb} alt="facebook" />
                    <img src={insta} alt="instagram" />
                    <img src={X} alt="X" />
                    <img src={pint} alt="pintrest" />
                    <img src={yt} alt="youtube" />
                </div>
            </div>
        </div>
        <div className='bg-black text-white flex flex-col justify-center items-center text-[12px] py-8'>
            <div className='flex'>
                <ul className='flex gap-4'>
                    <li className='hover:underline hover:underline-offset-4 hover:cursor-pointer'>Privacy Notice</li>
                    <li>|</li>
                    <li className='hover:underline hover:underline-offset-4 hover:cursor-pointer'>Cookie Preference</li>
                    <li>|</li>
                    <li className='hover:underline hover:underline-offset-4 hover:cursor-pointer'>Interest Based Ads</li>
                    <li>|</li>
                    <li className='hover:underline hover:underline-offset-4 hover:cursor-pointer'>CA Privacy Rights</li>
                    <li>|</li>
                    <li className='hover:underline hover:underline-offset-4 hover:cursor-pointer'>Do Not Sell or Share My Personal Information</li>
                    <li>|</li>
                    <li className='hover:underline hover:underline-offset-4 hover:cursor-pointer'>Legal Notice</li>
                    <li>|</li>
                    <li className='hover:underline hover:underline-offset-4 hover:cursor-pointer'>Customer Bill of Rights</li>
                </ul>
            </div>
            <div className='py-4'>
                <ul className='flex gap-4'>
                    <li className='hover:underline hover:underline-offset-4 hover:cursor-pointer'>CA Transparency in Supply Chains</li>
                    <li>|</li>
                    <li className='hover:underline hover:underline-offset-4 hover:cursor-pointer'>Product Recalls</li>
                    <li>|</li>
                    <li className='hover:underline hover:underline-offset-4 hover:cursor-pointer'>Pricing policy</li>
                    <li>|</li>
                    <li className='hover:underline hover:underline-offset-4 hover:cursor-pointer'>Accessibility</li>
                </ul>
            </div>
            <div>
                <h1>© 2024 Macy's. All rights reserved. Macys.com, LLC, 151 West 34th Street, New York, NY 10001. Request our <span className='underline cursor-pointer'>corporate name & address by email.</span></h1>
            </div>
        </div>
    </div>
  )
}

export default Footer