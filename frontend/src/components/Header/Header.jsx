import React, { useContext } from 'react'
import './Header.css'
import { StoreContext } from '../../Context/StoreContext'

const Header = () => {
    const { search, setSearch } = useContext(StoreContext);

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

    return (
        <div className='header'>
            <div className='header-contents'>
                <h2>Order your favourite food here</h2>
                <p>Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.</p>
                <div className='header-search'>
                    <input 
                        type="text" 
                        placeholder="Search your favourite food..." 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                        aria-label="Search food in hero section"
                    />
                    <button type="button" onClick={handleSearch} className='header-search-btn'>
                        Search
                    </button>
                </div>
                <div className='header-buttons'>
                    <a href='#explore-menu' className='header-view-menu-link'>
                        <button className='header-view-menu-btn' type="button">View Menu</button>
                    </a>
                    {search && (
                        <button 
                            className='header-clear-btn' 
                            type="button" 
                            onClick={() => setSearch('')}
                        >
                            Clear Search
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Header
