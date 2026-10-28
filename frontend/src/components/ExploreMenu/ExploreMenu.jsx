import React, { useContext, useRef, useEffect, useState } from 'react';
import './ExploreMenu.css';
import { StoreContext } from '../../Context/StoreContext';

const ExploreMenu = ({ category, setCategory }) => {
  const { menu_list } = useContext(StoreContext);
  const scrollContainerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // Combine All Dishes + category items and duplicate for infinite seamless loop
  const baseItems = [
    { id: 'all-dishes', isAll: true, name: 'All Dishes' },
    ...menu_list.map((m, idx) => ({ id: `cat-${idx}`, isAll: false, name: m.menu_name, image: m.menu_image }))
  ];
  const loopItems = [...baseItems, ...baseItems];

  // Smooth continuous auto-scroll effect
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let animationFrameId;
    let lastTime = performance.now();
    const speed = 38; // 38 pixels per second (smooth, comfortable viewing speed)

    const scrollStep = (currentTime) => {
      const elapsed = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (!isPaused && container) {
        container.scrollLeft += speed * elapsed;

        // When half of the duplicated list is scrolled past, seamlessly subtract half width
        const halfWidth = container.scrollWidth / 2;
        if (halfWidth > 0 && container.scrollLeft >= halfWidth) {
          container.scrollLeft -= halfWidth;
        }
      }

      animationFrameId = requestAnimationFrame(scrollStep);
    };

    animationFrameId = requestAnimationFrame(scrollStep);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPaused, menu_list.length]);

  // Manual scroll buttons
  const handleManualScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollDistance = 260;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollDistance : scrollDistance,
        behavior: 'smooth'
      });
    }
  };

  const handleItemClick = (item) => {
    if (item.isAll) {
      setCategory("All");
    } else {
      setCategory(prev => prev === item.name ? "All" : item.name);
    }
  };

  return (
    <div className='explore-menu' id='explore-menu'>
      <div className='explore-menu-top-bar'>
        <div className='explore-menu-header'>
          <h1>Explore Our Menu</h1>
          <p className='explore-menu-text'>
            Discover our handpicked dishes crafted with the finest ingredients and culinary love. Tap any category to filter, or tap again to show all dishes.
          </p>
        </div>
        <div className='menu-scroll-arrows'>
          <button 
            type="button" 
            className='menu-arrow-btn' 
            onClick={() => handleManualScroll('left')}
            title="Scroll menu left"
            aria-label="Scroll left"
          >
            ‹
          </button>
          <button 
            type="button" 
            className='menu-arrow-btn' 
            onClick={() => handleManualScroll('right')}
            title="Scroll menu right"
            aria-label="Scroll right"
          >
            ›
          </button>
        </div>
      </div>

      <div 
        className="explore-menu-list"
        ref={scrollContainerRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => {
          setTimeout(() => setIsPaused(false), 2000);
        }}
      >
        {loopItems.map((item, index) => {
          const isActive = item.isAll 
            ? category === "All" 
            : category === item.name;

          return (
            <div 
              onClick={() => handleItemClick(item)} 
              key={`${item.id}-${index}`} 
              className={`explore-menu-list-item ${isActive ? "selected" : ""}`}
            >
              {item.isAll ? (
                <div className={`all-menu-circle ${isActive ? "active" : ""}`}>
                  🍽️
                </div>
              ) : (
                <img 
                  src={item.image} 
                  className={isActive ? "active" : ""} 
                  alt={item.name} 
                />
              )}
              <p className={isActive ? "active-text" : ""}>{item.name}</p>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
