import React, { useState } from 'react';
import FoodPredictor from './FoodPredictor';

const FloatingPredictorWidget = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        // If we are on Home page and the section exists in view, we can also scroll to it, or open the modal
        const predictorElement = document.getElementById('food-predictor');
        if (predictorElement && window.scrollY < 400) {
            predictorElement.scrollIntoView({ behavior: 'smooth' });
        } else {
            setIsOpen(true);
        }
    };

    return (
        <>
            <div className='floating-predictor-widget'>
                <button 
                    type="button" 
                    className='floating-predictor-btn'
                    onClick={handleClick}
                    title="What should you eat today? Aaj Kya Khayein?"
                    aria-label="Predict what to eat today"
                >
                    <span className='floating-sparkle'>🔮</span>
                    <span>Aaj Kya Khayein?</span>
                </button>
            </div>

            {isOpen && (
                <div className='predictor-modal-overlay' onClick={() => setIsOpen(false)}>
                    <div className='predictor-modal-content' onClick={(e) => e.stopPropagation()}>
                        <FoodPredictor isModal={true} onClose={() => setIsOpen(false)} />
                    </div>
                </div>
            )}
        </>
    );
};

export default FloatingPredictorWidget;
