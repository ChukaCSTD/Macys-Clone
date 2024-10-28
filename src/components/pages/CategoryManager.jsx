import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { DashboardContext } from '../context/DashboardContext';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const BASE_URL = 'http://ecommerce.reworkstaging.name.ng/v2';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', image: '' });
  const [editingCategory, setEditingCategory] = useState(null);
  const { merchantId } = useContext(DashboardContext);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/categories?merchant_id=${merchantId}`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, [merchantId]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]); // Now fetchCategories is memoized and only changes when merchantId changes

  const handleCreateCategory = async () => {
    try {
      await axios.post(`${BASE_URL}/categories`, { ...newCategory, merchant_id: merchantId });
      fetchCategories();
      setNewCategory({ name: '', image: '' });
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleUpdateCategory = async () => {
    try {
      await axios.put(`${BASE_URL}/categories/${editingCategory.id}`, {
        name: editingCategory.name,
        image: editingCategory.image
      });
      fetchCategories();
      setEditingCategory(null);
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await axios.delete(`${BASE_URL}/categories/${categoryId}`);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Categories</h2>
      
      {/* Create Category Form */}
      <div className="mb-6 bg-gray-100 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Create New Category</h3>
        <input
          type="text"
          placeholder="Category Name"
          value={newCategory.name}
          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          className="border p-2 rounded mr-2 mb-2 w-1/2"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newCategory.image}
          onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
          className="border p-2 rounded mr-2 mb-2 w-1/2"
        />
        <button 
          onClick={handleCreateCategory}
          className="bg-green-500 text-white p-2 rounded flex items-center justify-center w-1/4 m-auto"
        >
          <FaPlus className="mr-2" /> Add Category
        </button>
      </div>

      {/* Categories List */}
      <ul className="space-y-4">
        {categories.map((category) => (
          <li key={category.id} className="border p-4 rounded-lg flex items-center justify-between">
            {editingCategory && editingCategory.id === category.id ? (
              <>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="border p-2 rounded mr-2"
                />
                <input
                  type="text"
                  value={editingCategory.image}
                  onChange={(e) => setEditingCategory({ ...editingCategory, image: e.target.value })}
                  className="border p-2 rounded mr-2"
                />
                <button onClick={handleUpdateCategory} className="bg-blue-500 text-white p-2 rounded">
                  Save
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center">
                  <img src={category.image} alt={category.name} className="w-12 h-12 object-cover rounded mr-4" />
                  <span className="font-semibold">{category.name}</span>
                </div>
                <div>
                  <button
                    onClick={() => setEditingCategory(category)}
                    className="bg-yellow-500 text-white p-2 rounded mr-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="bg-red-500 text-white p-2 rounded"
                  >
                    <FaTrash />
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryManager;