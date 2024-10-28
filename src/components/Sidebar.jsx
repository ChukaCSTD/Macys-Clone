import React from 'react';

function Sidebar({ isOpen, onMenuClick }) {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <ul>
        <li onClick={() => onMenuClick('product')}>Create Product</li>
        <li onClick={() => onMenuClick('category')}>Create Category</li>
      </ul>
    </div>
  );
}

export default Sidebar;