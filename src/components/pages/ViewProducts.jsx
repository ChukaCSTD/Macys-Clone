import React, { useState, useContext } from 'react';
import { FaFilter, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { DashboardContext } from '../context/DashboardContext';

const ViewProducts = ({ products: initialProducts, categories, onCategoryFilter }) => {
  const { updateProduct, deleteProduct } = useContext(DashboardContext);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editedProductId, setEditedProductId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [error, setError] = useState(null);
  const [products, setProducts] = useState(initialProducts);

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    onCategoryFilter(categoryId);
  };

  const handleEdit = async (productId) => {
    const updatedProduct = {
      title: editTitle,
      price: editPrice,
    };

    try {
      const response = await axios.put(
        `http://ecommerce.reworkstaging.name.ng/v2/products/${productId}`,
        updatedProduct
      );

      if (response.data) {
        // Update local state
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === productId ? { ...product, ...updatedProduct } : product
          )
        );

        // Update context
        updateProduct({ ...updatedProduct, id: productId });
        
        alert("Product edited successfully!");
      } else {
        setError("Failed to edit product");
        alert("Failed to edit product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setError("Failed to edit product");
      alert("Failed to edit product");
    } finally {
      resetEditFields();
    }
  };

  const handleDelete = async (productId) => {
    try {
      const response = await axios.delete(
        `http://ecommerce.reworkstaging.name.ng/v2/products/${productId}`
      );

      if (response.status === 200) {
        setProducts((prevProducts) => prevProducts.filter((p) => p.id !== productId));
        deleteProduct(productId);
        alert("Product deleted successfully!");
      } else {
        alert("Failed to delete product.");
        setError("Failed to delete product");
      }
    } catch (err) {
      console.error("Error deleting product", err);
      setError("Failed to delete product");
      alert("An error occurred while deleting the product.");
    }
  };

  const resetEditFields = () => {
    setEditedProductId(null);
    setEditTitle("");
    setEditPrice("");
    setError(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">View Products</h2>
      
      <div className="mb-4 flex items-center">
        <FaFilter className="mr-2 text-gray-600" />
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="p-2 border rounded"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded-lg shadow">
              <img
                src={product.images && product.images.length > 0 ? product.images[0] : product.imageUrl}
                alt={product.title}
                className="w-full h-48 object-contain mb-2 rounded"
              />
              {editedProductId === product.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Product Title"
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    placeholder="Product Price"
                    className="w-full p-2 border rounded"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(product.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={resetEditFields}
                      className="bg-gray-500 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-semibold">{product.title}</h3>
                  <p className="text-gray-600 truncate">{product.descp}</p>
                  <p className="text-blue-600 font-bold mt-2">USD {product.price}.00 {product.currency}</p>
                  <p className="text-gray-500 text-sm">Category: {product.category_name || 'not assigned a category'}</p>
                  <p className="text-gray-500 text-sm">Stock: {product.stock}</p>
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => {
                        setEditedProductId(product.id);
                        setEditTitle(product.title);
                        setEditPrice(product.price);
                      }}
                      className="bg-blue-500 text-white px-3 py-1 rounded flex items-center"
                    >
                      <FaEdit className="mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded flex items-center"
                    >
                      <FaTrash className="mr-1" /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewProducts;
