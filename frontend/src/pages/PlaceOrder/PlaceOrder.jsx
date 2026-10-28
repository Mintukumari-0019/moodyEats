import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const PlaceOrder = () => {
    const [payment, setPayment] = useState("stripe");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "India",
        phone: ""
    });

    const { 
        getSubtotal, 
        token, 
        user, 
        food_list, 
        cartItems, 
        url, 
        clearCart, 
        currency, 
        deliveryCharge,
        discount,
        appliedPromo
    } = useContext(StoreContext);

    const navigate = useNavigate();

    const subtotal = getSubtotal ? getSubtotal() : 0;
    const delivery = subtotal === 0 ? 0 : (appliedPromo?.code === "FREESHIP" ? 0 : deliveryCharge);
    const finalTotal = Math.max(0, subtotal + delivery - (discount || 0));

    // Prefill user details if available
    useEffect(() => {
        if (user) {
            const parts = (user.name || "").split(" ");
            setData(prev => ({
                ...prev,
                firstName: prev.firstName || parts[0] || "",
                lastName: prev.lastName || parts.slice(1).join(" ") || "",
                email: prev.email || user.email || ""
            }));
        }
    }, [user]);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const placeOrder = async (e) => {
        e.preventDefault();

        if (subtotal === 0) {
            toast.error("Your cart is empty");
            navigate('/cart');
            return;
        }

        const orderItems = [];
        food_list.forEach((item) => {
            if (cartItems[item._id] > 0) {
                orderItems.push({
                    _id: item._id,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    category: item.category,
                    quantity: cartItems[item._id]
                });
            }
        });

        const orderData = {
            address: data,
            items: orderItems,
            amount: finalTotal,
            promoCode: appliedPromo?.code || null,
            discount: discount || 0
        };

        setLoading(true);

        try {
            if (payment === "stripe") {
                toast.info("Connecting to Stripe Secure Gateway...");
                const response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
                
                if (response.data.success && response.data.session_url) {
                    if (clearCart) clearCart();
                    // Direct redirect to Stripe Checkout Hosted page
                    window.location.href = response.data.session_url;
                    return;
                } else {
                    toast.error(response.data.message || "Failed to start Stripe session");
                }
            } else {
                // Cash on delivery
                const response = await axios.post(url + "/api/order/placecod", orderData, { headers: { token } });
                if (response.data.success) {
                    toast.success(response.data.message || "Order placed successfully!");
                    if (clearCart) clearCart();
                    navigate("/myorders");
                } else {
                    toast.error(response.data.message || "Failed to place order");
                }
            }
        } catch (error) {
            console.error("Order error:", error);
            toast.error(error.response?.data?.message || "Could not complete order. Please verify backend connection.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            toast.error("Please sign in to place an order");
            navigate('/cart');
        } else if (subtotal === 0) {
            navigate('/cart');
        }
    }, [token, subtotal, navigate]);

    return (
        <form onSubmit={placeOrder} className='place-order'>
            <div className="place-order-left">
                <h2 className='place-order-heading'>Delivery Information</h2>
                
                <div className="multi-field">
                    <input 
                        type="text" 
                        name='firstName' 
                        onChange={onChangeHandler} 
                        value={data.firstName} 
                        placeholder='First Name' 
                        required 
                    />
                    <input 
                        type="text" 
                        name='lastName' 
                        onChange={onChangeHandler} 
                        value={data.lastName} 
                        placeholder='Last Name' 
                        required 
                    />
                </div>

                <input 
                    type="email" 
                    name='email' 
                    onChange={onChangeHandler} 
                    value={data.email} 
                    placeholder='Email Address' 
                    required 
                />
                <input 
                    type="text" 
                    name='street' 
                    onChange={onChangeHandler} 
                    value={data.street} 
                    placeholder='Street Address, Apartment, Suite' 
                    required 
                />

                <div className="multi-field">
                    <input 
                        type="text" 
                        name='city' 
                        onChange={onChangeHandler} 
                        value={data.city} 
                        placeholder='City' 
                        required 
                    />
                    <input 
                        type="text" 
                        name='state' 
                        onChange={onChangeHandler} 
                        value={data.state} 
                        placeholder='State' 
                        required 
                    />
                </div>

                <div className="multi-field">
                    <input 
                        type="text" 
                        name='zipcode' 
                        onChange={onChangeHandler} 
                        value={data.zipcode} 
                        placeholder='PIN / ZIP Code' 
                        required 
                    />
                    <input 
                        type="text" 
                        name='country' 
                        onChange={onChangeHandler} 
                        value={data.country} 
                        placeholder='Country' 
                        required 
                    />
                </div>

                <input 
                    type="tel" 
                    name='phone' 
                    onChange={onChangeHandler} 
                    value={data.phone} 
                    placeholder='Phone Number (for delivery updates)' 
                    required 
                />
            </div>

            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Order Summary</h2>
                    <div className='place-order-summary'>
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
                            <div className="cart-total-details order-discount-row">
                                <p>Promo Discount ({appliedPromo?.code})</p>
                                <p>-{currency}{discount}</p>
                            </div>
                          </>
                        )}
                        <hr />
                        <div className="cart-total-details order-grand-total">
                            <b>Total Amount</b>
                            <b>{currency}{finalTotal}</b>
                        </div>
                    </div>
                </div>

                <div className="payment-section">
                    <h2>Select Payment Method</h2>
                    <div 
                        onClick={() => setPayment("stripe")} 
                        className={`payment-option ${payment === "stripe" ? "active" : ""}`}
                    >
                        <span className="payment-radio">
                            {payment === "stripe" ? "🔘" : "⚪"}
                        </span>
                        <div>
                            <b>💳 Stripe Online Payment (Cards, Netbanking, UPI)</b>
                            <p className="payment-desc">Instant online payment with official Stripe Checkout</p>
                        </div>
                    </div>

                    <div 
                        onClick={() => setPayment("cod")} 
                        className={`payment-option ${payment === "cod" ? "active" : ""}`}
                    >
                        <span className="payment-radio">
                            {payment === "cod" ? "🔘" : "⚪"}
                        </span>
                        <div>
                            <b>💵 Cash on Delivery (COD)</b>
                            <p className="payment-desc">Pay in cash or scan UPI code when your food arrives</p>
                        </div>
                    </div>
                </div>

                <button 
                    className='place-order-submit-btn' 
                    type='submit' 
                    disabled={loading}
                >
                    {loading ? "PROCESSING..." : (payment === "stripe" ? "PROCEED TO STRIPE CHECKOUT 🔒" : "CONFIRM COD ORDER 📦")}
                </button>
            </div>
        </form>
    );
};

export default PlaceOrder;
