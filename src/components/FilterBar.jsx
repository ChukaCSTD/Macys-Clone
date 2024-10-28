import React from 'react';

const FilterBar = ({ onFilterChange }) => {
  return (
    <div className="filter-bar mb-6 flex justify-between items-center">
      <select onChange={(e) => onFilterChange(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2">
        <option value="default">Sort by Featured</option>
        <option value="priceLowToHigh">Price: Low to High</option>
        <option value="priceHighToLow">Price: High to Low</option>
      </select>
      <button className="bg-gray-800 text-white px-4 py-2 rounded-md">Filter</button>
    </div>
  );
};

export default FilterBar;
