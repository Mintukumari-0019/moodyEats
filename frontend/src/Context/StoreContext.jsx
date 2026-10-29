import { createContext, useEffect, useState } from "react";
import { food_list as defaultFoodList, menu_list } from "../assets/assets";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const url = import.meta.env.VITE_API_URL;
    const [food_list, setFoodList] = useState(defaultFoodList);
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("");
    const [user, setUser] = useState(null);
    const [search, setSearch] = useState("");
    const [appliedPromo, setAppliedPromo] = useState(null);
    const [discount, setDiscount] = useState(0);

    const currency = "₹";
    const deliveryCharge = 50;

    const addToCart = async (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1
        }));

        if (token) {
            try {
                await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
            } catch (error) {
                console.log("Add to cart error:", error.message);
            }
        }
    };

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => {
            const current = prev[itemId] || 0;
            if (current <= 1) {
                const updated = { ...prev };
                delete updated[itemId];
                return updated;
            }
            return { ...prev, [itemId]: current - 1 };
        });

        if (token) {
            try {
                await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
            } catch (error) {
                console.log("Remove from cart error:", error.message);
            }
        }
    };

    const deleteFromCart = async (itemId) => {
        setCartItems((prev) => {
            const updated = { ...prev };
            delete updated[itemId];
            return updated;
        });

        if (token) {
            try {
                // remove remaining
                await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
            } catch (error) {
                console.log("Delete from cart error:", error.message);
            }
        }
    };

    const clearCart = () => {
        setCartItems({});
        setAppliedPromo(null);
        setDiscount(0);
    };

    const getSubtotal = () => {
        let total = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                const itemInfo = food_list.find((product) => String(product._id) === String(item));
                if (itemInfo) {
                    total += itemInfo.price * cartItems[item];
                }
            }
        }
        return total;
    };

    const getTotalCartAmount = () => {
        return getSubtotal();
    };

    const getTotalCartQuantity = () => {
        let count = 0;
        for (const item in cartItems) {
            count += cartItems[item] || 0;
        }
        return count;
    };

    const applyPromo = (code) => {
        const cleanCode = (code || "").trim().toUpperCase();
        const subtotal = getSubtotal();

        if (subtotal === 0) {
            return { success: false, message: "Add items to cart first" };
        }

        if (cleanCode === "MOODY10") {
            const disc = Math.round(subtotal * 0.10);
            setDiscount(disc);
            setAppliedPromo({ code: cleanCode, discount: disc, description: "10% OFF" });
            return { success: true, message: `Promo code MOODY10 applied! You saved ${currency}${disc}` };
        } else if (cleanCode === "FIRST50") {
            const disc = Math.min(50, subtotal);
            setDiscount(disc);
            setAppliedPromo({ code: cleanCode, discount: disc, description: `₹50 OFF` });
            return { success: true, message: `Promo code FIRST50 applied! You saved ${currency}${disc}` };
        } else if (cleanCode === "FREESHIP") {
            setDiscount(deliveryCharge);
            setAppliedPromo({ code: cleanCode, discount: deliveryCharge, description: "Free Delivery" });
            return { success: true, message: "Free Delivery promo applied!" };
        } else {
            return { success: false, message: "Invalid promo code. Try MOODY10 or FIRST50!" };
        }
    };

    const removePromo = () => {
        setAppliedPromo(null);
        setDiscount(0);
    };

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(url + "/api/food/list");
            if (response.data && response.data.data && response.data.data.length > 0) {
                setFoodList(response.data.data);
            }
        } catch (error) {
            console.log("Backend not available, using default items:", error.message);
        }
    };

    const loadCartData = async (token) => {
        try {
            const response = await axios.post(url + "/api/cart/get", {}, { headers: token });
            if (response.data && response.data.cartData) {
                setCartItems(response.data.cartData);
            }
        } catch (error) {
            console.log("Cart load error:", error.message);
        }
    };

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            const savedToken = localStorage.getItem("token");
            const savedUser = localStorage.getItem("user");
            if (savedToken) {
                setToken(savedToken);
                await loadCartData({ token: savedToken });
            }
            if (savedUser) {
                try {
                    setUser(JSON.parse(savedUser));
                } catch (e) {
                    // ignore
                }
            }
        }
        loadData();
    }, []);

    const contextValue = {
        url,
        food_list,
        menu_list,
        cartItems,
        addToCart,
        removeFromCart,
        deleteFromCart,
        clearCart,
        getSubtotal,
        getTotalCartAmount,
        getTotalCartQuantity,
        appliedPromo,
        discount,
        applyPromo,
        removePromo,
        token,
        setToken,
        user,
        setUser,
        loadCartData,
        setCartItems,
        currency,
        deliveryCharge,
        search,
        setSearch
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
