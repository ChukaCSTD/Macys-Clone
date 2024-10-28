import React from 'react';
import heroImage from '../images/hero.webp'; // Import the hero image
import gridImage from '../images/grid.webp'; // Import the hero image
import grid2Image from '../images/grid2.webp'; // Import the hero image

function Homepage() {
  return (
    <div className="homepage">
        <section className="hero">
            <img src={heroImage} alt="Hero" className="hero-image mx-auto" /> {/* Add hero image */}
        </section>
        <section>
            <img src={gridImage} alt="Grid" className="mx-auto my-16 cursor-pointer" />
        </section>
        <section>
            <img src={grid2Image} alt="Grid-2" className="mx-auto my-14 w-[95%]" />
        </section>

        <section className='flex justify-between px-10 pb-20'>
            <h1 className='font-bold text-[25px]'>Recently Viewed Items</h1>
            <div>
                <h1 className='underline cursor-pointer'>Done</h1>
            </div>
        </section>        
    </div>
  );
}

export default Homepage;