import React, { useContext, useState } from 'react';
import './Cart.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Cart = () => {
  const {
    cartItems,
    food_list,
    addToCart,
    removeFromCart,
    deleteFromCart,
    getSubtotal,
    appliedPromo,
    discount,
    applyPromo,
    removePromo,
    url,
    currency,
    deliveryCharge
  } = useContext(StoreContext);

  const [promoInput, setPromoInput] = useState("");
  const navigate = useNavigate();

  const subtotal = getSubtotal ? getSubtotal() : 0;
  const delivery = subtotal === 0 ? 0 : (appliedPromo?.code === "FREESHIP" ? 0 : deliveryCharge);
  const finalTotal = Math.max(0, subtotal + delivery - (discount || 0));

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) {
      toast.warning("Please enter a promo code");
      return;
    }
    const result = applyPromo(promoInput);
    if (result.success) {
      toast.success(result.message);
      setPromoInput("");
    } else {
      toast.error(result.message);
    }
  };

  const getImageSrc = (image) => {
    if (typeof image === 'string' && (image.startsWith('/') || image.startsWith('http') || image.startsWith('data:'))) {
      return image;
    }
    return `${url}/images/${image}`;
  };

  // Check if any items in cart
  const hasItems = Object.keys(cartItems).some((key) => cartItems[key] > 0);

  if (!hasItems) {
    return (
      <div className='cart-empty-state'>
        <div className='cart-empty-card'>
          <div className='empty-cart-icon'>🛒</div>
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added any delicious food yet.</p>
          <button onClick={() => navigate('/')} className='browse-menu-btn'>
            Explore Menu & Order Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='cart'>
      <h2 className='cart-main-heading'>Your Shopping Cart</h2>

      <div className="cart-items">
        <div className="cart-items-title">
          <p>Item</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <hr className='cart-divider' />

        {food_list.map((item) => {
          const qty = cartItems[item._id];
          if (qty > 0) {
            return (
              <div key={item._id} className="cart-row-container">
                <div className="cart-items-title cart-items-item">
                  <img src={getImageSrc(item.image)} alt={item.name} className='cart-product-thumb' />
                  <p className='cart-product-name'>{item.name}</p>
                  <p className='cart-product-price'>{currency}{item.price}</p>
                  
                  <div className='cart-qty-controls'>
                    <button 
                      type="button" 
                      onClick={() => removeFromCart(item._id)} 
                      className='qty-btn'
                      title="Decrease"
                    >
                      -
                    </button>
                    <span className='qty-count'>{qty}</span>
                    <button 
                      type="button" 
                      onClick={() => addToCart(item._id)} 
                      className='qty-btn'
                      title="Increase"
                    >
                      +
                    </button>
                  </div>

                  <p className='cart-product-subtotal'>{currency}{item.price * qty}</p>
                  <button 
                    type="button" 
                    className='cart-items-remove-icon' 
                    onClick={() => deleteFromCart(item._id)}
                    title="Remove from cart"
                  >
                    ✕
                  </button>
                </div>
                <hr className='cart-item-divider' />
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Order Summary</h2>
          <div className='cart-summary-box'>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>{currency}{subtotal}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>{delivery === 0 ? "FREE" : `${currency}${delivery}`}</p>
            </div>
            {discount > 0 && (
              <>
                <hr />
                <div className="cart-total-details discount-row">
                  <p>Promo Discount ({appliedPromo?.code})</p>
                  <p>-{currency}{discount}</p>
                </div>
              </>
            )}
            <hr />
            <div className="cart-total-details cart-total-highlight">
              <b>Grand Total</b>
              <b>{currency}{finalTotal}</b>
            </div>
          </div>
          <button 
            type="button" 
            className="checkout-btn" 
            onClick={() => navigate('/order')}
          >
            PROCEED TO CHECKOUT
          </button>
        </div>

        <div className="cart-promocode">
          <div className='cart-promocode-card'>
            <h3>Have a Promo Code?</h3>
            <p>Enter your coupon below to get instant discounts!</p>
            
            {appliedPromo ? (
              <div className='promo-applied-badge'>
                <span>✅ Code <b>{appliedPromo.code}</b> applied! ({appliedPromo.description})</span>
                <button type="button" onClick={removePromo} className='promo-remove-btn'>
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className='cart-promocode-input'>
                <input 
                  type="text" 
                  placeholder='Enter code (e.g. MOODY10)' 
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                />
                <button type="submit">Apply</button>
              </form>
            )}

            <div className='promo-hints'>
              <p className='hints-title'>Available Coupons:</p>
              <div className='hints-pills'>
                <span onClick={() => { setPromoInput("MOODY10"); applyPromo("MOODY10"); }}>
                  🏷️ <b>MOODY10</b> (10% off)
                </span>
                <span onClick={() => { setPromoInput("FIRST50"); applyPromo("FIRST50"); }}>
                  🏷️ <b>FIRST50</b> (₹50 off)
                </span>
                <span onClick={() => { setPromoInput("FREESHIP"); applyPromo("FREESHIP"); }}>
                  🚚 <b>FREESHIP</b> (Free delivery)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
