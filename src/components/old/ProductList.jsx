import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [merchantId, setMerchantId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editedProductId, setEditedProductId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPrice, setEditPrice] = useState("");

  const merchant = JSON.parse(localStorage.getItem('merchant'));

  useEffect(() => {
    if (merchant) {
      setMerchantId(merchant.id);
    }
  }, [merchant]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!merchantId) return;

      try {
        const response = await axios.get(
          `http://ecommerce.reworkstaging.name.ng/v2/products?merchant_id=${merchantId}`
        );
        setProducts(response.data.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [merchantId]);

  // Function to handle edit product
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

      console.log("Response from editing product:", response.data); // Log the API response

      // Check for success response from API
      if (response.data) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === productId ? { ...product, ...updatedProduct } : product
          )
        );

        alert("Product edited successfully!"); // Show success message
      } else {
        setError("Failed to edit product");
        alert("Failed to edit product"); // Show alert for failure
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setError("Failed to edit product");
      alert("Failed to edit product"); // Show alert for failure
    } finally {
      resetEditFields(); // Reset editing fields
    }
  };

  // Function to handle delete product
  const handleDelete = async (productId) => {
    try {
      const response = await axios.delete(
        `http://ecommerce.reworkstaging.name.ng/v2/products/${productId}`
      );

      if (response.status === 200) { // Check if response status is 200
        setProducts((prevProducts) => prevProducts.filter((p) => p.id !== productId));
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
    <div id="d-dashboard-all" className="p-4">
      <b id="d-dashboardTitle" className="text-xl font-bold">
        All Products
      </b>

      {/* Grid for product headings */}
      <div className="grid grid-cols-6 gap-4 mt-4 py-2 border-t border-gray-300 font-bold">
        <div><p>S/N</p></div>
        <div><p>Product</p></div>
        <div><p>Image</p></div>
        <div><p>Price</p></div>
        <div><p>Quantity Available</p></div>
        <div><p>Actions</p></div>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div id="d-dashboard-all-items">
          {products.length > 0 ? (
            products.map((product, index) => (
              <div
                key={product.id}
                className="grid grid-cols-6 gap-4 mt-2 py-2 border-t border-gray-200"
              >
                <div><p>{index + 1}</p></div>
                <div><p>{product.title}</p></div>
                <div>
                  <div className="w-24 h-24">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="object-contain w-full h-full"
                    />
                  </div>
                </div>
                <div><p>{product.currency}{product.price}</p></div>
                <div><p>{product.quantity}</p></div>
                <div>
                  <button
                    onClick={() => {
                      setEditedProductId(product.id);
                      setEditTitle(product.title);
                      setEditPrice(product.price);
                    }}
                    className="bg-blue-500 text-white py-1 px-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-500 text-white py-1 px-2 rounded ml-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No products available</p>
          )}
        </div>
      )}

      {/* Edit Product Modal */}
      {editedProductId && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-5 rounded shadow-md">
            <h2 className="text-lg font-bold">Edit Product</h2>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Product Title"
              className="border border-gray-300 p-2 rounded w-full mt-2"
            />
            <input
              type="number"
              value={editPrice}
              onChange={(e) => setEditPrice(e.target.value)}
              placeholder="Product Price"
              className="border border-gray-300 p-2 rounded w-full mt-2"
            />
            <div className="flex justify-end">
              <button
                onClick={() => handleEdit(editedProductId)}
                className="bg-green-500 text-white py-2 px-4 rounded mt-2"
              >
                Save Changes
              </button>
              <button
                onClick={resetEditFields}
                className="bg-gray-500 text-white py-2 px-4 rounded mt-2 ml-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
