import React, { useContext } from 'react';
import './Header.css';
import { StoreContext } from '../../Context/StoreContext';

const Header = () => {
    const { search, setSearch } = useContext(StoreContext);

    const popularTags = ["Salad", "Rolls", "Pasta", "Sandwich", "Cake", "Noodles"];

    const handleSearch = () => {
        const foodSection = document.getElementById('food-display');
        if (foodSection) {
            foodSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleTagClick = (tag) => {
        setSearch(tag);
        handleSearch();
    };

    return (
        <header className='header'>
            <div className='header-overlay'></div>
            <div className='header-contents'>
                {/* Feature highlights pill */}
                <div className='header-badge-row'>
                    <span className='header-tag'>🔥 Fast & Fresh Food Delivery</span>
                    <span className='header-sub-tag'>⚡ 30-Min Express</span>
                    <span className='header-sub-tag'>⭐ 4.9+ Rating</span>
                </div>

                <h2>
                    Delicious Food, <br />
                    Delivered <span className='header-highlight-text'>Hot & Fresh</span>
                </h2>

                <p>
                    Craving something mouthwatering? Explore authentic flavors, fresh gourmet meals, and local favorite cuisines made with premium ingredients and delivered piping hot to your door.
                </p>

                {/* Modern Search Bar */}
                <div className='header-search-wrapper'>
                    <div className='header-search-bar'>
                        <span className='header-search-icon'>🔍</span>
                        <input 
                            type="text" 
                            placeholder="Search dishes, rolls, cakes, salads, pasta..." 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleKeyDown}
                            aria-label="Search food dishes"
                        />
                        {search && (
                            <button 
                                type="button" 
                                className='header-search-clear'
                                onClick={() => setSearch('')}
                                title="Clear search"
                            >
                                ✕
                            </button>
                        )}
                        <button 
                            type="button" 
                            onClick={handleSearch} 
                            className='header-search-btn'
                        >
                            <span>Search Dishes</span>
                        </button>
                    </div>

                    {/* Quick Interactive Tags */}
                    <div className='header-quick-tags'>
                        <span className='tags-label'>Popular Searches:</span>
                        {popularTags.map(tag => (
                            <button 
                                key={tag} 
                                type="button"
                                className={`tag-pill ${search.toLowerCase() === tag.toLowerCase() ? 'active' : ''}`}
                                onClick={() => handleTagClick(tag)}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                <div className='header-cta-row'>
                    <a href='#explore-menu' className='header-menu-cta'>
                        <span>Explore Menu</span>
                        <span className='cta-arrow'>↓</span>
                    </a>
                    <a href='#food-display' className='header-dishes-cta'>
                        <span>🔥 Trending Dishes</span>
                    </a>
                </div>
            </div>
        </header>
    );
};

export default Header;
