import React, { useState } from 'react';
import './Contact.css';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });

  const [faqOpen, setFaqOpen] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleFaq = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("Thank you! Your message has been sent to the MoodyEats team.");
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: ''
      });
      setIsSubmitting(false);
    }, 600);
  };

  const faqs = [
    {
      q: "How can I track my food order?",
      a: "Once your order is placed, you can go to 'My Orders' from the profile dropdown in the navbar to check live status updates (Food Processing, Out for delivery, Delivered)."
    },
    {
      q: "What are your delivery hours and charges?",
      a: "We deliver 7 days a week from 8:00 AM to 2:00 AM. Standard delivery fee is ₹50, and you can get free delivery using promo code FREESHIP on eligible orders!"
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept Cash on Delivery (COD), UPI, Debit Cards, Credit Cards, and Netbanking through our secure Stripe payment gateway."
    },
    {
      q: "How do I become a restaurant partner on MoodyEats?",
      a: "Select 'Restaurant Partner' in the contact form inquiry dropdown and send us your business details. Our onboarding manager will reach out within 24 hours."
    }
  ];

  return (
    <div className='contact-page' id='contact'>
      {/* Header Banner */}
      <div className='contact-header'>
        <span className='contact-badge'>💬 We're Here For You</span>
        <h1>Contact & Customer Support</h1>
        <p>Have a question about an order, restaurant partner inquiry, or feedback? Our team is always ready to assist you!</p>
      </div>

      <div className='contact-grid'>
        {/* Left Column: Quick Contact Info */}
        <div className='contact-info-panel'>
          <h2>Reach Out To Us</h2>
          <p className='info-subtext'>Connect with our friendly support representatives via phone, email, or visit our headquarters.</p>

          <div className='info-cards'>
            <div className='info-card'>
              <div className='info-icon'>📞</div>
              <div className='info-text'>
                <h4>Customer Helpline</h4>
                <p>+91 98765 43210</p>
                <span>Toll-Free, 24/7 Available</span>
              </div>
            </div>

            <div className='info-card'>
              <div className='info-icon'>✉️</div>
              <div className='info-text'>
                <h4>Email Support</h4>
                <p>support@moodyeats.com</p>
                <span>Replies within 30 minutes</span>
              </div>
            </div>

            <div className='info-card'>
              <div className='info-icon'>📍</div>
              <div className='info-text'>
                <h4>Headquarters</h4>
                <p>123 Gourmet Food Boulevard, Tech Park</p>
                <span>Bengaluru, Karnataka - 560100</span>
              </div>
            </div>

            <div className='info-card'>
              <div className='info-icon'>⏰</div>
              <div className='info-text'>
                <h4>Operating Hours</h4>
                <p>Monday - Sunday</p>
                <span>8:00 AM - 2:00 AM IST</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className='contact-form-panel'>
          <h2>Send Us A Message</h2>
          <p className='form-subtext'>Fill in your details and we will respond as soon as possible.</p>

          <form onSubmit={handleSubmit} className='contact-form'>
            <div className='form-row'>
              <div className='form-group'>
                <label>Your Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="e.g. Rahul Sharma" 
                  required 
                />
              </div>

              <div className='form-group'>
                <label>Email Address *</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="name@example.com" 
                  required 
                />
              </div>
            </div>

            <div className='form-row'>
              <div className='form-group'>
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  placeholder="+91 98765 00000" 
                />
              </div>

              <div className='form-group'>
                <label>Subject / Topic *</label>
                <select name="subject" value={formData.subject} onChange={handleChange}>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Order & Delivery Issue">Order & Delivery Issue</option>
                  <option value="Restaurant Partner">Restaurant Partner</option>
                  <option value="Refund & Billing">Refund & Billing</option>
                  <option value="Feedback & Suggestions">Feedback & Suggestions</option>
                </select>
              </div>
            </div>

            <div className='form-group'>
              <label>Your Message *</label>
              <textarea 
                name="message" 
                rows="5" 
                value={formData.message} 
                onChange={handleChange} 
                placeholder="Write your message or inquiry here..." 
                required 
              />
            </div>

            <button type="submit" className='contact-submit-btn' disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message 🚀"}
            </button>
          </form>
        </div>
      </div>

      {/* FAQ Section */}
      <div className='contact-faq-section'>
        <h2>Frequently Asked Questions</h2>
        <p className='faq-subtitle'>Quick answers to common questions about MoodyEats services</p>

        <div className='faq-accordion'>
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={`faq-item ${faqOpen === idx ? 'open' : ''}`}
              onClick={() => toggleFaq(idx)}
            >
              <div className='faq-question'>
                <h4>{faq.q}</h4>
                <span className='faq-toggle-icon'>{faqOpen === idx ? '−' : '+'}</span>
              </div>
              {faqOpen === idx && (
                <div className='faq-answer'>
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;
