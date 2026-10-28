import React, { useState } from 'react';
import './Add.css';
import { assets, url, currency } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const Add = () => {
    const [image, setImage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Salad"
    });

    const categories = [
        "Salad", "Rolls", "Deserts", "Sandwich", 
        "Cake", "Pure Veg", "Pasta", "Noodles"
    ];

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if (!image) {
            toast.error('Please select an image for the food item');
            return null;
        }

        if (Number(data.price) <= 0) {
            toast.error('Please enter a valid price greater than 0');
            return null;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", data.name.trim());
            formData.append("description", data.description.trim());
            formData.append("price", Number(data.price));
            formData.append("category", data.category);
            formData.append("image", image);

            const response = await axios.post(`${url}/api/food/add`, formData);
            if (response.data.success) {
                toast.success(response.data.message || 'Food item added successfully!');
                setData({
                    name: "",
                    description: "",
                    price: "",
                    category: data.category
                });
                setImage(false);
            } else {
                toast.error(response.data.message || 'Failed to add food item');
            }
        } catch (error) {
            console.error("Add food error:", error);
            toast.error(error.response?.data?.message || 'Server connection error. Make sure backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const previewImgUrl = image ? URL.createObjectURL(image) : null;

    return (
        <div className='add-food-page'>
            <div className='add-food-header'>
                <h2>Add New Food Item</h2>
                <p>Fill out the dish details and view real-time customer presentation before publishing.</p>
            </div>

            <div className='add-food-grid'>
                {/* Left: Input Form */}
                <div className='add-form-card'>
                    <form onSubmit={onSubmitHandler} className='add-food-form'>
                        <div className='form-section'>
                            <label className='form-label'>Dish Photograph *</label>
                            <div className='upload-dropzone'>
                                <input 
                                    onChange={(e) => { 
                                        if (e.target.files && e.target.files[0]) {
                                            setImage(e.target.files[0]); 
                                        }
                                        e.target.value = ''; 
                                    }} 
                                    type="file" 
                                    accept="image/*" 
                                    id="food-image-input" 
                                    hidden 
                                />
                                <label htmlFor="food-image-input" className='dropzone-label'>
                                    {previewImgUrl ? (
                                        <div className='preview-image-wrapper'>
                                            <img src={previewImgUrl} alt="Dish preview" className='uploaded-preview' />
                                            <span className='change-overlay'>Click to Change Photo 📷</span>
                                        </div>
                                    ) : (
                                        <div className='dropzone-placeholder'>
                                            <img src={assets.upload_area} alt="Upload area" className='upload-icon' />
                                            <span className='upload-main-text'>Click or Drag Dish Image Here</span>
                                            <span className='upload-sub-text'>PNG, JPG, WEBP (Max 5MB)</span>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>

                        <div className='form-section'>
                            <label className='form-label' htmlFor='dish-name'>Dish Name *</label>
                            <input 
                                id='dish-name'
                                name='name' 
                                onChange={onChangeHandler} 
                                value={data.name} 
                                type="text" 
                                placeholder='e.g., Gourmet Truffle Pasta, Spicy Veggie Roll' 
                                required 
                                className='add-input'
                            />
                        </div>

                        <div className='form-section'>
                            <label className='form-label' htmlFor='dish-desc'>Description *</label>
                            <textarea 
                                id='dish-desc'
                                name='description' 
                                onChange={onChangeHandler} 
                                value={data.description} 
                                rows={3} 
                                placeholder='Describe the ingredients, taste, and culinary highlights...' 
                                required 
                                className='add-textarea'
                            />
                        </div>

                        <div className='form-row-split'>
                            <div className='form-section flex-1'>
                                <label className='form-label' htmlFor='dish-cat'>Menu Category *</label>
                                <select 
                                    id='dish-cat'
                                    name='category' 
                                    value={data.category} 
                                    onChange={onChangeHandler}
                                    className='add-select'
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className='form-section flex-1'>
                                <label className='form-label' htmlFor='dish-price'>Price ({currency}) *</label>
                                <div className='price-input-wrapper'>
                                    <span className='currency-prefix'>{currency}</span>
                                    <input 
                                        id='dish-price'
                                        type="number" 
                                        name='price' 
                                        onChange={onChangeHandler} 
                                        value={data.price} 
                                        placeholder='199' 
                                        min="1"
                                        required
                                        className='add-input price-input'
                                    />
                                </div>
                            </div>
                        </div>

                        <button type='submit' className='publish-dish-btn' disabled={loading}>
                            {loading ? (
                                <span>Publishing to Store... ⏳</span>
                            ) : (
                                <span>🚀 Publish Food Item</span>
                            )}
                        </button>
                    </form>
                </div>

                {/* Right: Real-time Live Customer Card Preview */}
                <div className='preview-column'>
                    <div className='preview-sticky-card'>
                        <div className='preview-card-header'>
                            <h4>Live Customer Card Preview</h4>
                            <span className='preview-hint-badge'>Customer View</span>
                        </div>

                        <div className='mock-customer-card'>
                            <div className='mock-img-container'>
                                {previewImgUrl ? (
                                    <img src={previewImgUrl} alt="Preview" className='mock-food-img' />
                                ) : (
                                    <div className='mock-no-img'>
                                        <span>🍽️</span>
                                        <p>Upload an image to see live photo preview</p>
                                    </div>
                                )}
                                <span className='mock-category-pill'>{data.category}</span>
                            </div>

                            <div className='mock-info-container'>
                                <div className='mock-name-row'>
                                    <h5>{data.name || "Delicious Dish Name"}</h5>
                                    <span className='mock-rating'>⭐⭐⭐⭐⭐</span>
                                </div>
                                <p className='mock-desc'>
                                    {data.description || "Freshly cooked gourmet meal made with handpicked ingredients and authentic secret spices."}
                                </p>
                                <div className='mock-price-row'>
                                    <span className='mock-price'>
                                        {currency}{data.price ? Number(data.price).toLocaleString() : "199"}
                                    </span>
                                    <span className='mock-add-btn'>+ Add</span>
                                </div>
                            </div>
                        </div>

                        <div className='preview-tips-box'>
                            <b>💡 Menu Item Best Practices:</b>
                            <ul>
                                <li>Use bright, high-resolution square/horizontal photos.</li>
                                <li>Mention key ingredients or allergens in the description.</li>
                                <li>Set competitive prices to maximize ordering volume.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Add;
