import React, { useEffect, useState } from 'react';
import './List.css';
import { url, currency, assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Edit Modal State
  const [editingItem, setEditingItem] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  const categories = ["All", "Salad", "Rolls", "Deserts", "Sandwich", "Cake", "Pure Veg", "Pasta", "Noodles"];

  const fetchList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data || []);
      } else {
        toast.error("Failed to fetch food list");
      }
    } catch (error) {
      console.error("Fetch list error:", error);
      toast.error("Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  const removeFood = async (foodId, foodName) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${foodName || 'this item'}" from the menu?`)) {
      return;
    }
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
      if (response.data.success) {
        toast.success(response.data.message || "Food item deleted");
        await fetchList();
      } else {
        toast.error(response.data.message || "Failed to remove food item");
      }
    } catch (error) {
      console.error("Remove food error:", error);
      toast.error("Error deleting food item");
    }
  };

  const openEditModal = (item) => {
    setEditingItem({
      _id: item._id,
      name: item.name,
      description: item.description || '',
      price: item.price,
      category: item.category,
      currentImage: item.image
    });
    setEditImage(null);
  };

  const handleEditChange = (e) => {
    setEditingItem({
      ...editingItem,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    if (Number(editingItem.price) <= 0) {
      toast.error("Please enter a valid price greater than 0");
      return;
    }

    setEditLoading(true);
    try {
      const formData = new FormData();
      formData.append("id", editingItem._id);
      formData.append("name", editingItem.name.trim());
      formData.append("description", (editingItem.description || '').trim());
      formData.append("price", Number(editingItem.price));
      formData.append("category", editingItem.category);
      if (editImage) {
        formData.append("image", editImage);
      }

      const response = await axios.post(`${url}/api/food/update`, formData);
      if (response.data.success) {
        toast.success(response.data.message || "Food item updated successfully!");
        setEditingItem(null);
        setEditImage(null);
        await fetchList();
      } else {
        toast.error(response.data.message || "Failed to update item");
      }
    } catch (error) {
      console.error("Update food error:", error);
      toast.error(error.response?.data?.message || "Failed to save changes");
    } finally {
      setEditLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const filteredList = list.filter((item) => {
    const matchesCat = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
    return matchesCat && matchesSearch;
  });

  const getImageSrc = (image) => {
    if (typeof image === 'string' && (image.startsWith('/') || image.startsWith('http') || image.startsWith('data:'))) {
      return image;
    }
    return `${url}/images/${image}`;
  };

  return (
    <div className='list-container'>
      <div className='list-header'>
        <div>
          <h3>Food Menu Inventory</h3>
          <p className='list-subtitle'>Manage dishes, edit details, update prices, and remove items</p>
        </div>
        <button className='refresh-list-btn' onClick={fetchList}>
          🔄 Refresh
        </button>
      </div>

      {/* Search and Category Filter Toolbar */}
      <div className='list-toolbar'>
        <div className='toolbar-search'>
          <span className='search-icon'>🔍</span>
          <input 
            type="text" 
            placeholder="Search dish by name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className='clear-btn' onClick={() => setSearchQuery('')}>✕</button>
          )}
        </div>

        <div className='toolbar-categories'>
          {categories.map((cat, idx) => (
            <button 
              key={idx} 
              className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className='list-loading'>
          <p>Loading inventory...</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className='list-empty'>
          <p>No dishes match your filter criteria.</p>
          <span>Try clearing the search or category filters.</span>
        </div>
      ) : (
        <div className='list-table-card'>
          <div className="list-table-format title">
            <b>Image</b>
            <b>Dish Name</b>
            <b>Category</b>
            <b>Price</b>
            <b>Actions</b>
          </div>
          {filteredList.map((item, index) => {
            return (
              <div key={item._id || index} className='list-table-format'>
                <img src={getImageSrc(item.image)} alt={item.name} className='table-item-img' />
                <p className='table-item-name'>{item.name}</p>
                <p><span className='category-tag'>{item.category}</span></p>
                <p className='table-item-price'>{currency}{item.price}</p>
                <div className='table-actions'>
                  <button 
                    type="button" 
                    className='edit-item-btn' 
                    onClick={() => openEditModal(item)}
                    title="Edit item details"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    type="button" 
                    className='delete-item-btn' 
                    onClick={() => removeFood(item._id, item.name)}
                    title="Delete item"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Food Modal */}
      {editingItem && (
        <div className='edit-modal-overlay' onClick={() => setEditingItem(null)}>
          <div className='edit-modal' onClick={(e) => e.stopPropagation()}>
            <div className='edit-modal-header'>
              <h3>✏️ Edit Food Item</h3>
              <button 
                type="button" 
                className='close-modal-btn' 
                onClick={() => setEditingItem(null)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className='edit-modal-form'>
              <div className='edit-img-picker'>
                <label>Dish Photo (Click to replace)</label>
                <input 
                  type="file" 
                  id="editImageFile" 
                  accept="image/*" 
                  hidden 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setEditImage(e.target.files[0]);
                    }
                  }} 
                />
                <label htmlFor="editImageFile" className='edit-image-preview-label'>
                  <img 
                    src={editImage ? URL.createObjectURL(editImage) : getImageSrc(editingItem.currentImage)} 
                    alt="Preview" 
                    className='edit-preview-img'
                  />
                  <span className='change-img-badge'>📷 Change Image</span>
                </label>
              </div>

              <div className='edit-input-group'>
                <label>Dish Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  value={editingItem.name} 
                  onChange={handleEditChange} 
                  required 
                />
              </div>

              <div className='edit-row'>
                <div className='edit-input-group'>
                  <label>Category *</label>
                  <select name="category" value={editingItem.category} onChange={handleEditChange}>
                    <option value="Salad">Salad</option>
                    <option value="Rolls">Rolls</option>
                    <option value="Deserts">Deserts</option>
                    <option value="Sandwich">Sandwich</option>
                    <option value="Cake">Cake</option>
                    <option value="Pure Veg">Pure Veg</option>
                    <option value="Pasta">Pasta</option>
                    <option value="Noodles">Noodles</option>
                  </select>
                </div>

                <div className='edit-input-group'>
                  <label>Price ({currency}) *</label>
                  <input 
                    type="number" 
                    name="price" 
                    value={editingItem.price} 
                    onChange={handleEditChange} 
                    min="1"
                    required 
                  />
                </div>
              </div>

              <div className='edit-input-group'>
                <label>Description</label>
                <textarea 
                  name="description" 
                  rows="3" 
                  value={editingItem.description} 
                  onChange={handleEditChange} 
                />
              </div>

              <div className='edit-modal-footer'>
                <button 
                  type="button" 
                  className='modal-cancel-btn' 
                  onClick={() => setEditingItem(null)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className='modal-save-btn' 
                  disabled={editLoading}
                >
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
