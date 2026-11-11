// Food Prediction & Smart Suggestion Engine for MoodyEats

export const MEAL_SLOTS = [
    { id: 'breakfast', name: 'Breakfast (Nashta)', icon: '🌅', start: 5, end: 11, hint: 'Light, healthy & energizing start' },
    { id: 'lunch', name: 'Lunch (Dopahar)', icon: '☀️', start: 11, end: 16, hint: 'Hearty, wholesome & filling' },
    { id: 'snack', name: 'Snacks (Chai Time)', icon: '☕', start: 16, end: 19, hint: 'Quick, crispy & tasty bites' },
    { id: 'dinner', name: 'Dinner (Raat Ka Khana)', icon: '🌙', start: 19, end: 23, hint: 'Warm, comforting & satisfying' },
    { id: 'midnight', name: 'Midnight Cravings', icon: '✨', start: 23, end: 5, hint: 'Late night guilt-free cravings' },
];

export const MOOD_OPTIONS = [
    {
        id: 'tired',
        label: 'Tired & Lazy',
        hindiLabel: 'Thaka hua / Aalas',
        emoji: '😴',
        tagline: 'Warm Comfort Food',
        favCategories: ['Pasta', 'Noodles', 'Rolls', 'Sandwich'],
        color: '#FF7A59',
        reasonTemplate: 'Thake hue din ke baad zero effort wala warm comfort food! Yeh dish aapki thakan door karke relaxing vibe degi.'
    },
    {
        id: 'happy',
        label: 'Happy & Celebrating',
        hindiLabel: 'Khush & Party Mood',
        emoji: '🥳',
        tagline: 'Sweet & Party Treats',
        favCategories: ['Cake', 'Deserts', 'Pasta', 'Rolls'],
        color: '#FFB800',
        reasonTemplate: 'Khushi ke palon ko aur special banayein! A delicious treat to celebrate your amazing mood today.'
    },
    {
        id: 'rainy',
        label: 'Cozy / Rainy Vibes',
        hindiLabel: 'Mausam Mast / Barish',
        emoji: '🌧️',
        tagline: 'Hot & Steamy Bites',
        favCategories: ['Noodles', 'Pasta', 'Rolls', 'Pure Veg'],
        color: '#4C6EF5',
        reasonTemplate: 'Suhane mausam me garma-garam steamy flavors ka maza! Perfect companion for a chill cozy evening.'
    },
    {
        id: 'healthy',
        label: 'Fit & Healthy',
        hindiLabel: 'Diet & Freshness',
        emoji: '🥗',
        tagline: 'Nutritious & Fresh',
        favCategories: ['Salad', 'Pure Veg', 'Sandwich'],
        color: '#20C997',
        reasonTemplate: 'Clean eating ka perfect choice! Fresh greens, clean vitamins aur full energy bina kisi guilt ke.'
    },
    {
        id: 'stressed',
        label: 'Stressed / Work Load',
        hindiLabel: 'Stress Buster',
        emoji: '😤',
        tagline: 'Mood Lifter & Carbs',
        favCategories: ['Deserts', 'Cake', 'Pasta', 'Noodles'],
        color: '#E03131',
        reasonTemplate: 'Deep breath lein! Yeh rich comforting treat dopamine release karegi aur aapka mood instant lift hoga.'
    },
    {
        id: 'spicy',
        label: 'Spicy & Chatpata',
        hindiLabel: 'Teekha & Masaledar',
        emoji: '🌶️',
        tagline: 'Bold & Fiery Kick',
        favCategories: ['Rolls', 'Noodles', 'Pure Veg'],
        color: '#FA5252',
        reasonTemplate: 'Aapki tastebuds ko chahiye ek zesty jhatka! Bold spices aur tangy masala jo craving ko turant shant kare.'
    }
];

export const CRAVING_OPTIONS = [
    { id: 'all', label: 'Surprise Me', emoji: '🎲' },
    { id: 'cheesy', label: 'Cheesy & Creamy', emoji: '🧀' },
    { id: 'spicy', label: 'Spicy & Masaledar', emoji: '🌶️' },
    { id: 'sweet', label: 'Sweet Tooth', emoji: '🍫' },
    { id: 'healthy', label: 'Light & Crisp', emoji: '🥑' },
    { id: 'warm', label: 'Warm & Comforting', emoji: '🍲' },
    { id: 'quick', label: 'Quick Street Bites', emoji: '🥪' },
];

export const DIETARY_OPTIONS = [
    { id: 'all', label: 'All Items 🍽️' },
    { id: 'veg', label: 'Pure Veg 🌱' },
    { id: 'nonveg', label: 'Non-Veg 🍗' },
];

/**
 * Detect current meal slot based on device hour
 */
export const getCurrentMealSlot = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return 'breakfast';
    if (hour >= 11 && hour < 16) return 'lunch';
    if (hour >= 16 && hour < 19) return 'snack';
    if (hour >= 19 && hour < 23) return 'dinner';
    return 'midnight';
};

/**
 * Checks if a food item is vegetarian
 */
export const isVegItem = (item) => {
    const name = (item.name || '').toLowerCase();
    const desc = (item.description || '').toLowerCase();
    const cat = (item.category || '').toLowerCase();

    if (cat === 'pure veg') return true;
    if (name.includes('chicken') || desc.includes('chicken') || 
        name.includes('meat') || name.includes('fish') || name.includes('egg')) {
        return false;
    }
    return true;
};

/**
 * Generates engaging mood match tags and custom reasons
 */
const getDishReason = (item, moodObj, mealSlotObj, cravingId) => {
    const name = item.name;
    const cat = item.category;

    if (cravingId === 'sweet' || cat === 'Cake' || cat === 'Deserts') {
        return `Aaj ke meethe ki craving ko satisfy karne ke liye ${name} ekdum perfect hai. Fresh, delightful aur instant happiness guaranteed!`;
    }

    if (cravingId === 'spicy' || name.toLowerCase().includes('peri peri')) {
        return `Zesty spicy craving ke liye ${name} ek bold hit hai. Tangy spices aapki energy ko refresh kar denge!`;
    }

    if (cravingId === 'cheesy' || name.toLowerCase().includes('cheese') || name.toLowerCase().includes('creamy')) {
        return `Rich melted goodness! ${name} ka har bite warm, cheesy aur comforting hai jo mood ko relax kar deta hai.`;
    }

    if (cat === 'Salad' || cravingId === 'healthy') {
        return `Clean, crunchy aur nutrient-dense! ${name} aapko heavy feel karwaye bina full day hydrated aur energized rakhega.`;
    }

    if (mealSlotObj.id === 'lunch' || mealSlotObj.id === 'dinner') {
        return `${mealSlotObj.name} ke liye ${name} ek wholesome, piping hot choice hai. Filling aur flavorful, perfect for today!`;
    }

    if (mealSlotObj.id === 'midnight') {
        return `Late night hunger pangs? ${name} is the ultimate midnight craving saver. Quick, delicious and deeply satisfying!`;
    }

    return moodObj ? moodObj.reasonTemplate : `Aaj ke mood aur time ke according ${name} sabse badhiya choice hai!`;
};

/**
 * Main prediction algorithm
 */
export const predictFoodItems = (foodList = [], options = {}) => {
    if (!foodList || foodList.length === 0) {
        return { primary: null, alternatives: [], meta: {} };
    }

    const {
        mood = 'happy',
        mealTime = getCurrentMealSlot(),
        craving = 'all',
        dietary = 'all',
        seed = Math.random()
    } = options;

    const moodObj = MOOD_OPTIONS.find(m => m.id === mood) || MOOD_OPTIONS[0];
    const mealSlotObj = MEAL_SLOTS.find(s => s.id === mealTime) || MEAL_SLOTS[3];

    // 1. Dietary Filtering
    let eligibleFoods = foodList.filter(item => {
        const isVeg = isVegItem(item);
        if (dietary === 'veg') return isVeg;
        if (dietary === 'nonveg') return !isVeg;
        return true;
    });

    if (eligibleFoods.length === 0) {
        eligibleFoods = [...foodList];
    }

    // 2. Score Calculation
    const scoredFoods = eligibleFoods.map((item, idx) => {
        let score = 50; // base score
        const name = (item.name || '').toLowerCase();
        const desc = (item.description || '').toLowerCase();
        const cat = item.category || '';

        // Mood affinity boost
        if (moodObj.favCategories.includes(cat)) {
            score += 30;
        }

        // Meal time affinity
        if (mealTime === 'breakfast' && ['Salad', 'Sandwich'].includes(cat)) score += 20;
        if (mealTime === 'lunch' && ['Pure Veg', 'Pasta', 'Rolls', 'Sandwich'].includes(cat)) score += 20;
        if (mealTime === 'snack' && ['Rolls', 'Sandwich', 'Noodles', 'Deserts'].includes(cat)) score += 20;
        if (mealTime === 'dinner' && ['Pasta', 'Pure Veg', 'Noodles'].includes(cat)) score += 20;
        if (mealTime === 'midnight' && ['Deserts', 'Cake', 'Noodles', 'Sandwich'].includes(cat)) score += 25;

        // Craving affinity
        if (craving === 'cheesy') {
            if (name.includes('cheese') || name.includes('creamy') || desc.includes('cheese')) score += 35;
            if (cat === 'Pasta') score += 15;
        } else if (craving === 'spicy') {
            if (name.includes('peri') || name.includes('spicy') || name.includes('garlic')) score += 35;
            if (cat === 'Rolls' || cat === 'Noodles') score += 15;
        } else if (craving === 'sweet') {
            if (cat === 'Deserts' || cat === 'Cake' || name.includes('cake') || name.includes('cream')) score += 40;
        } else if (craving === 'healthy') {
            if (cat === 'Salad' || cat === 'Pure Veg') score += 35;
        } else if (craving === 'warm') {
            if (cat === 'Pasta' || cat === 'Noodles' || cat === 'Pure Veg') score += 25;
        } else if (craving === 'quick') {
            if (cat === 'Rolls' || cat === 'Sandwich') score += 30;
        }

        // Subtle randomized variance to avoid showing identical results repeatedly
        const pseudoRandom = Math.sin((idx + 1) * 997 + seed * 1000) * 8;
        score += pseudoRandom;

        return { item, score };
    });

    // Sort descending by score
    scoredFoods.sort((a, b) => b.score - a.score);

    const primaryEntry = scoredFoods[0];
    const topAlternatives = scoredFoods.slice(1, 4).map(e => e.item);

    if (!primaryEntry) {
        return { primary: null, alternatives: [], meta: {} };
    }

    // Match percentage (between 92% and 99%)
    const matchScore = Math.min(99, Math.max(92, Math.round(85 + (primaryEntry.score / 150) * 14)));

    const primaryDish = primaryEntry.item;
    const personalizedReason = getDishReason(primaryDish, moodObj, mealSlotObj, craving);

    const isVeg = isVegItem(primaryDish);

    return {
        primary: {
            ...primaryDish,
            matchScore,
            isVeg,
            reason: personalizedReason,
            vibeTag: moodObj.tagline,
            moodLabel: moodObj.label,
            mealSlot: mealSlotObj.name,
            mealIcon: mealSlotObj.icon
        },
        alternatives: topAlternatives.map(item => ({
            ...item,
            isVeg: isVegItem(item),
            matchScore: Math.round(matchScore - Math.random() * 5 - 2)
        })),
        meta: {
            selectedMood: moodObj,
            selectedMealSlot: mealSlotObj,
            selectedCraving: craving,
            selectedDietary: dietary
        }
    };
};

/**
 * 1-Click Surprise Meal Predictor (Aaj Kya Khayein?)
 */
export const getSurprisePrediction = (foodList = [], dietary = 'all') => {
    if (!foodList || foodList.length === 0) return null;

    let filtered = foodList.filter(item => {
        const isVeg = isVegItem(item);
        if (dietary === 'veg') return isVeg;
        if (dietary === 'nonveg') return !isVeg;
        return true;
    });

    if (filtered.length === 0) filtered = foodList;

    const randomIndex = Math.floor(Math.random() * filtered.length);
    const chosen = filtered[randomIndex];
    const mealTime = getCurrentMealSlot();
    const mealSlotObj = MEAL_SLOTS.find(s => s.id === mealTime) || MEAL_SLOTS[3];

    const surpriseReasons = [
        `Kismat ne chun liya hai! Aaj ke ${mealSlotObj.name} ke liye ${chosen.name} se behtar koi choice nahi ho sakti. Enjoy karein!`,
        `Confused the ki kya khana hai? MoodyEats AI recommends ${chosen.name} – Taste guaranteed, zero confusion!`,
        `The culinary stars have spoken! Aaj aapke table par ${chosen.name} aana banta hai.`,
        `Aaj ka Special Surprise: ${chosen.name}! Perfect balance of delicious flavor aur satisfaction.`
    ];

    const randomReason = surpriseReasons[Math.floor(Math.random() * surpriseReasons.length)];

    return {
        ...chosen,
        matchScore: 99,
        isVeg: isVegItem(chosen),
        reason: randomReason,
        vibeTag: '🎲 Star Surprise Pick',
        mealSlot: mealSlotObj.name,
        mealIcon: mealSlotObj.icon
    };
};
