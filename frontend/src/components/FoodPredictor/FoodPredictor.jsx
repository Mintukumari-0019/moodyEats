import React, { useState, useContext, useEffect, useMemo } from 'react';
import './FoodPredictor.css';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import { 
    MOOD_OPTIONS, 
    CRAVING_OPTIONS, 
    MEAL_SLOTS, 
    DIETARY_OPTIONS, 
    getCurrentMealSlot, 
    predictFoodItems, 
    getSurprisePrediction,
    isVegItem 
} from './foodPredictorLogic';
import { toast } from 'react-toastify';

// Soft, pleasant audio chime using browser Web Audio API
const playChimeSound = () => {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
            ctx.resume();
        }
        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 major triad
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
            gain.gain.setValueAtTime(0.001, ctx.currentTime + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + i * 0.08 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.35);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + i * 0.08);
            osc.stop(ctx.currentTime + i * 0.08 + 0.38);
        });
    } catch (e) {
        // audio might be blocked or unsupported; silent fallback
    }
};

const FoodPredictor = ({ isModal = false, onClose = () => {} }) => {
    const { food_list, cartItems, addToCart, removeFromCart, url, currency, setSearch } = useContext(StoreContext);

    const [selectedMood, setSelectedMood] = useState('happy');
    const [selectedMealTime, setSelectedMealTime] = useState(getCurrentMealSlot());
    const [selectedCraving, setSelectedCraving] = useState('all');
    const [selectedDietary, setSelectedDietary] = useState('all');
    const [seed, setSeed] = useState(Math.random());
    const [showMealTimeDropdown, setShowMealTimeDropdown] = useState(false);

    // Shuffler / Spin states
    const [isSpinning, setIsSpinning] = useState(false);
    const [spinDisplayItem, setSpinDisplayItem] = useState(null);

    // Calculate prediction based on current choices
    const predictionResult = useMemo(() => {
        return predictFoodItems(food_list, {
            mood: selectedMood,
            mealTime: selectedMealTime,
            craving: selectedCraving,
            dietary: selectedDietary,
            seed: seed
        });
    }, [food_list, selectedMood, selectedMealTime, selectedCraving, selectedDietary, seed]);

    // Active displayed prediction (primary or spun)
    const [displayedDish, setDisplayedDish] = useState(null);

    useEffect(() => {
        if (!isSpinning && predictionResult.primary) {
            setDisplayedDish(predictionResult.primary);
        }
    }, [predictionResult, isSpinning]);

    const handleMoodSelect = (moodId) => {
        setSelectedMood(moodId);
        setSeed(Math.random());
        playChimeSound();
    };

    const handleCravingSelect = (cravingId) => {
        setSelectedCraving(cravingId === selectedCraving ? 'all' : cravingId);
        setSeed(Math.random());
        playChimeSound();
    };

    const handleRegenerate = () => {
        setSeed(Math.random());
        playChimeSound();
        toast.success("✨ Nayi curated dish predict ho gayi!", { autoClose: 1600 });
    };

    // 1-Click Spin & Surprise shuffler
    const handleSpinSurprise = () => {
        if (!food_list || food_list.length === 0) return;
        setIsSpinning(true);

        let counter = 0;
        const totalCycles = 14;
        const interval = setInterval(() => {
            const randomItem = food_list[Math.floor(Math.random() * food_list.length)];
            setSpinDisplayItem(randomItem);
            counter++;

            if (counter >= totalCycles) {
                clearInterval(interval);
                const surprise = getSurprisePrediction(food_list, selectedDietary);
                setDisplayedDish(surprise);
                setIsSpinning(false);
                playChimeSound();
                toast.success("🎉 Aaj ke liye aapki special surprise dish!", { autoClose: 2200 });
            }
        }, 85);
    };

    const getImageSrc = (image) => {
        if (!image) return '';
        const isLocalOrDirect = typeof image === 'string' && (
            image.startsWith('/') || image.startsWith('http') || image.startsWith('data:')
        );
        return isLocalOrDirect ? image : `${url}/images/${image}`;
    };

    const currentMealInfo = MEAL_SLOTS.find(s => s.id === selectedMealTime) || MEAL_SLOTS[3];
    const currentMoodInfo = MOOD_OPTIONS.find(m => m.id === selectedMood) || MOOD_OPTIONS[0];

    const currentCartCount = (displayedDish && cartItems[displayedDish._id]) || 0;

    const handleFilterMenuByCategory = (category) => {
        if (setSearch) {
            setSearch(category);
        }
        if (isModal) onClose();
        const foodSection = document.getElementById('food-display');
        if (foodSection) {
            foodSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className={`food-predictor-wrapper ${isModal ? 'as-modal' : ''}`} id='food-predictor'>
            <div className='stylish-predictor-container'>
                {isModal && (
                    <button 
                        type="button" 
                        className='stylish-close-modal' 
                        onClick={onClose}
                        title="Close Predictor"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                )}

                {/* Top Bar: Title & 1-Click Surprise CTA */}
                <div className='stylish-top-bar'>
                    <div className='top-bar-left'>
                        <div className='ai-pill-badge'>
                            <span className='ai-spark-dot'></span>
                            <span>MoodyEats AI Chef</span>
                        </div>
                        <h2 className='stylish-heading'>
                            Aaj Kya Khayein? <span className='stylish-gradient-text'>Pick Your Vibe</span> 🍽️
                        </h2>
                        <div className='meal-context-row'>
                            <span className='meal-context-icon'>{currentMealInfo.icon}</span>
                            <span className='meal-context-text'>{currentMealInfo.name}</span>
                            <div className='meal-time-dropdown-wrap'>
                                <button 
                                    type="button" 
                                    className='meal-time-change-btn'
                                    onClick={() => setShowMealTimeDropdown(prev => !prev)}
                                >
                                    Change Time ▾
                                </button>
                                {showMealTimeDropdown && (
                                    <div className='meal-dropdown-menu'>
                                        {MEAL_SLOTS.map(slot => (
                                            <button
                                                key={slot.id}
                                                type="button"
                                                className={`meal-dropdown-item ${selectedMealTime === slot.id ? 'active' : ''}`}
                                                onClick={() => {
                                                    setSelectedMealTime(slot.id);
                                                    setShowMealTimeDropdown(false);
                                                    setSeed(Math.random());
                                                }}
                                            >
                                                <span>{slot.icon}</span>
                                                <span>{slot.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className='top-bar-right'>
                        <button 
                            type="button" 
                            className={`magic-surprise-btn ${isSpinning ? 'spinning' : ''}`}
                            onClick={handleSpinSurprise}
                            disabled={isSpinning}
                            title="Confused? Let AI pick instantly!"
                        >
                            <span className='dice-icon'>🎲</span>
                            <div className='surprise-btn-text'>
                                <span className='btn-main-title'>{isSpinning ? "Predicting..." : "Surprise Me!"}</span>
                                <span className='btn-sub-title'>1-Click Magic Roll</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Sleek Vibe Track & Dietary Segment */}
                <div className='stylish-vibe-bar'>
                    <div className='vibe-pills-track'>
                        {MOOD_OPTIONS.map(mood => {
                            const isSelected = selectedMood === mood.id;
                            return (
                                <button
                                    key={mood.id}
                                    type="button"
                                    className={`vibe-chip ${isSelected ? 'active' : ''}`}
                                    onClick={() => handleMoodSelect(mood.id)}
                                >
                                    <span className='vibe-chip-emoji'>{mood.emoji}</span>
                                    <span className='vibe-chip-name'>{mood.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className='dietary-segmented-control'>
                        {DIETARY_OPTIONS.map(diet => (
                            <button
                                key={diet.id}
                                type="button"
                                className={`diet-segment-btn ${selectedDietary === diet.id ? 'active' : ''}`}
                                onClick={() => { setSelectedDietary(diet.id); setSeed(Math.random()); }}
                            >
                                {diet.label.replace(' Items', '')}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Gourmet Bento Grid */}
                <div className='stylish-bento-grid'>
                    {/* Main Featured Prediction Card */}
                    <div className='bento-hero-dish'>
                        {isSpinning && spinDisplayItem ? (
                            <div className='stylish-spinning-state'>
                                <div className='pulse-glow-ring'></div>
                                <img 
                                    src={getImageSrc(spinDisplayItem.image)} 
                                    alt={spinDisplayItem.name} 
                                    className='spinning-food-disc'
                                />
                                <h4>Selecting the ultimate dish for you...</h4>
                                <p className='spinning-dish-preview'>{spinDisplayItem.name}</p>
                            </div>
                        ) : displayedDish ? (
                            <div className='gourmet-card-content'>
                                {/* Visual Showcase Left */}
                                <div className='gourmet-plate-wrap'>
                                    <div className='ambient-food-glow'></div>
                                    <img 
                                        src={getImageSrc(displayedDish.image)} 
                                        alt={displayedDish.name} 
                                        className='gourmet-dish-img'
                                    />
                                    <div className='plate-top-badge'>
                                        <span className='match-pill-ribbon'>
                                            ⭐ {displayedDish.matchScore || 98}% Mood Match
                                        </span>
                                    </div>
                                    <div className='plate-bottom-badge'>
                                        <span className={`dish-diet-pill ${displayedDish.isVeg ? 'veg' : 'non-veg'}`}>
                                            <span className='diet-dot'></span>
                                            {displayedDish.isVeg ? 'Pure Veg' : 'Non-Veg'}
                                        </span>
                                    </div>
                                </div>

                                {/* Details Right */}
                                <div className='gourmet-details-col'>
                                    <div className='details-header-row'>
                                        <span className='gourmet-category-tag'>🍽️ {displayedDish.category}</span>
                                        <span className='gourmet-vibe-tag'>✨ {displayedDish.vibeTag || currentMoodInfo.tagline}</span>
                                    </div>

                                    <h3 className='gourmet-dish-name'>{displayedDish.name}</h3>

                                    <div className='gourmet-price-rating'>
                                        <div className='gourmet-price'>
                                            <span className='currency-symbol'>{currency}</span>
                                            <span className='amount-value'>{displayedDish.price}</span>
                                        </div>
                                        <div className='gourmet-rating'>
                                            <img src={assets.rating_starts} alt="Rating" className='stars-icon' />
                                            <span className='rating-num'>4.9 / 5</span>
                                        </div>
                                    </div>

                                    {/* Chef's Tasting Note */}
                                    <div className='chef-tasting-note'>
                                        <span className='quote-glyph'>“</span>
                                        <p className='chef-note-text'>
                                            {displayedDish.reason || 'Aaj ke mood aur meal time ke mutabiq yeh sabse tasty, warm aur relaxing option hai!'}
                                        </p>
                                    </div>

                                    {/* Action Row */}
                                    <div className='gourmet-action-row'>
                                        {currentCartCount === 0 ? (
                                            <button 
                                                type="button" 
                                                className='gourmet-cart-btn'
                                                onClick={() => {
                                                    addToCart(displayedDish._id);
                                                    playChimeSound();
                                                    toast.success(`🛒 ${displayedDish.name} add ho gaya!`);
                                                }}
                                            >
                                                <span>Add to Feast</span>
                                                <span className='btn-badge'>{currency}{displayedDish.price}</span>
                                            </button>
                                        ) : (
                                            <div className='gourmet-quantity-pill'>
                                                <span className='qty-label'>In Cart:</span>
                                                <button 
                                                    type="button" 
                                                    onClick={() => removeFromCart(displayedDish._id)}
                                                    className='qty-btn'
                                                >
                                                    -
                                                </button>
                                                <span className='qty-number'>{currentCartCount}</span>
                                                <button 
                                                    type="button" 
                                                    onClick={() => addToCart(displayedDish._id)}
                                                    className='qty-btn'
                                                >
                                                    +
                                                </button>
                                            </div>
                                        )}

                                        <button 
                                            type="button" 
                                            className='gourmet-shuffle-btn' 
                                            onClick={handleRegenerate}
                                            title="Try another suggestion for this mood"
                                        >
                                            <span>🔄 Predict Next</span>
                                        </button>

                                        <button
                                            type="button"
                                            className='gourmet-explore-link'
                                            onClick={() => handleFilterMenuByCategory(displayedDish.category)}
                                        >
                                            <span>Menu View →</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>

                    {/* Right Side Bento: Cravings & Alternates */}
                    <div className='bento-side-column'>
                        {/* Flavor Craving Quick Filter */}
                        <div className='side-flavor-box'>
                            <span className='side-box-title'>Craving a specific flavor?</span>
                            <div className='quick-flavor-tags'>
                                {CRAVING_OPTIONS.filter(c => c.id !== 'all').map(craving => (
                                    <button
                                        key={craving.id}
                                        type="button"
                                        className={`flavor-mini-chip ${selectedCraving === craving.id ? 'active' : ''}`}
                                        onClick={() => handleCravingSelect(craving.id)}
                                    >
                                        <span>{craving.emoji}</span>
                                        <span>{craving.label.split(' ')[0]}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Top 3 Alternates */}
                        <div className='side-alternates-box'>
                            <span className='side-box-title'>✨ You Might Also Love</span>
                            <div className='alternates-list'>
                                {predictionResult.alternatives && predictionResult.alternatives.length > 0 ? (
                                    predictionResult.alternatives.slice(0, 3).map(alt => {
                                        const altCount = cartItems[alt._id] || 0;
                                        return (
                                            <div key={alt._id} className='alternate-dish-row'>
                                                <img 
                                                    src={getImageSrc(alt.image)} 
                                                    alt={alt.name} 
                                                    className='alt-row-thumb'
                                                />
                                                <div className='alt-row-info'>
                                                    <div className='alt-row-title'>
                                                        <span className={`alt-diet-dot ${alt.isVeg ? 'veg' : 'non-veg'}`}></span>
                                                        <span className='alt-name-text'>{alt.name}</span>
                                                    </div>
                                                    <span className='alt-row-meta'>
                                                        {currency}{alt.price} • {alt.category}
                                                    </span>
                                                </div>

                                                <div className='alt-row-action'>
                                                    {altCount === 0 ? (
                                                        <button 
                                                            type="button" 
                                                            className='alt-quick-add'
                                                            onClick={() => {
                                                                addToCart(alt._id);
                                                                toast.success(`Added ${alt.name}`);
                                                            }}
                                                            title="Add to cart"
                                                        >
                                                            +
                                                        </button>
                                                    ) : (
                                                        <div className='alt-mini-counter'>
                                                            <button type="button" onClick={() => removeFromCart(alt._id)}>-</button>
                                                            <span>{altCount}</span>
                                                            <button type="button" onClick={() => addToCart(alt._id)}>+</button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className='no-alt-text'>Select a mood above to view matching pairings.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FoodPredictor;
