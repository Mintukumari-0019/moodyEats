import userModel from "../models/userModel.js";

// add to user cart  
const addToCart = async (req, res) => {
   try {
      const userData = await userModel.findById(req.body.userId);
      if (!userData) {
         return res.status(404).json({ success: false, message: "User not found" });
      }

      const cartData = userData.cartData || {};
      const itemId = req.body.itemId;
      if (!cartData[itemId]) {
         cartData[itemId] = 1;
      } else {
         cartData[itemId] += 1;
      }

      await userModel.findByIdAndUpdate(req.body.userId, { cartData });
      res.json({ success: true, message: "Added to cart" });
   } catch (error) {
      console.error("Add to cart error:", error);
      res.status(500).json({ success: false, message: "Failed to add to cart" });
   }
};

// remove food from user cart
const removeFromCart = async (req, res) => {
   try {
      const userData = await userModel.findById(req.body.userId);
      if (!userData) {
         return res.status(404).json({ success: false, message: "User not found" });
      }

      const cartData = userData.cartData || {};
      const itemId = req.body.itemId;
      if (cartData[itemId] && cartData[itemId] > 0) {
         cartData[itemId] -= 1;
         if (cartData[itemId] === 0) {
            delete cartData[itemId];
         }
      }

      await userModel.findByIdAndUpdate(req.body.userId, { cartData });
      res.json({ success: true, message: "Removed from cart" });
   } catch (error) {
      console.error("Remove from cart error:", error);
      res.status(500).json({ success: false, message: "Failed to remove from cart" });
   }
};

// get user cart
const getCart = async (req, res) => {
   try {
      const userData = await userModel.findById(req.body.userId);
      if (!userData) {
         return res.status(404).json({ success: false, message: "User not found" });
      }
      res.json({ success: true, cartData: userData.cartData || {} });
   } catch (error) {
      console.error("Get cart error:", error);
      res.status(500).json({ success: false, message: "Failed to load cart" });
   }
};

export { addToCart, removeFromCart, getCart };
