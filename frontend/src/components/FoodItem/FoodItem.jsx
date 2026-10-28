import React, { useContext } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';

const FoodItem = ({ image, name, price, desc, id }) => {
    const { cartItems, addToCart, removeFromCart, url, currency } = useContext(StoreContext);

    const isLocalOrDirect = typeof image === 'string' && (image.startsWith('/') || image.startsWith('http') || image.startsWith('data:'));
    const imageSrc = isLocalOrDirect ? image : `${url}/images/${image}`;

    const count = cartItems[id] || 0;

    return (
        <div className='food-item'>
            <div className='food-item-img-container'>
                <img className='food-item-image' src={imageSrc} alt={name} loading="lazy" />
                {count === 0 ? (
                    <button 
                        type="button" 
                        className='add-icon-btn' 
                        onClick={() => addToCart(id)} 
                        title="Add to cart"
                        aria-label={`Add ${name} to cart`}
                    >
                        <img src={assets.add_icon_white} alt="Add" />
                    </button>
                ) : (
                    <div className="food-item-counter">
                        <button 
                            type="button" 
                            className="counter-btn" 
                            onClick={() => removeFromCart(id)}
                            title="Decrease quantity"
                        >
                            <img src={assets.remove_icon_red} alt="Remove" />
                        </button>
                        <span className="counter-number">{count}</span>
                        <button 
                            type="button" 
                            className="counter-btn" 
                            onClick={() => addToCart(id)}
                            title="Increase quantity"
                        >
                            <img src={assets.add_icon_green} alt="Add more" />
                        </button>
                    </div>
                )}
            </div>

            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p className="food-name">{name}</p>
                    <img src={assets.rating_starts} alt="Rating" className="rating-stars" />
                </div>
                <p className="food-item-desc">{desc}</p>
                <div className="food-item-bottom">
                    <p className="food-item-price">{currency}{price}</p>
                    {count > 0 && <span className="in-cart-indicator">Added to Cart</span>}
                </div>
            </div>
        </div>
    );
};

export default FoodItem;
