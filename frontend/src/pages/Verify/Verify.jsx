import axios from 'axios';
import React, { useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import { toast } from 'react-toastify';
import './Verify.css';

const Verify = () => {
  const { url } = useContext(StoreContext);
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const navigate = useNavigate();

  const verifyPayment = async () => {
    try {
      const response = await axios.post(url + "/api/order/verify", { success, orderId });
      if (response.data.success) {
        toast.success("Payment verified! Your order is placed.");
        navigate("/myorders");
      } else {
        toast.error("Payment could not be completed.");
        navigate("/");
      }
    } catch (error) {
      console.error("Verification error:", error);
      if (success === "true") {
        toast.success("Order confirmed!");
        navigate("/myorders");
      } else {
        toast.error("Payment cancelled or failed.");
        navigate("/");
      }
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []);

  return (
    <div className='verify-page'>
      <div className='verify-box'>
        <div className="spinner"></div>
        <h3>Verifying Your Payment</h3>
        <p>Please wait a moment while we confirm your order details...</p>
      </div>
    </div>
  );
};

export default Verify;
