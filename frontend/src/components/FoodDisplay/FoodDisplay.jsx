import React, { useContext } from 'react'
import './FoodDisplay.css'
import FoodItem from '../FoodItem/FoodItem'
import { StoreContext } from '../../Context/StoreContext'

const FoodDisplay = ({ category }) => {

  const { food_list, search, setSearch } = useContext(StoreContext);

  const trimmedSearch = (search || "").trim().toLowerCase();

  const filteredFoods = (food_list || []).filter((item) => {
    const matchesCategory = category === "All" || category === item.category;
    const matchesSearch = !trimmedSearch ||
      item.name.toLowerCase().includes(trimmedSearch) ||
      item.category.toLowerCase().includes(trimmedSearch) ||
      (item.description && item.description.toLowerCase().includes(trimmedSearch));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className='food-display' id='food-display'>
      <div className='food-display-header'>
        <h2>{search ? `Search results for "${search}"` : "Top dishes near you"}</h2>
        {search && (
          <button 
            type="button" 
            className='clear-search-btn' 
            onClick={() => setSearch("")}
          >
            Clear Search ({filteredFoods.length} {filteredFoods.length === 1 ? 'dish' : 'dishes'} found) ✕
          </button>
        )}
      </div>

      <div className='food-display-list'>
        {filteredFoods.length > 0 ? (
          filteredFoods.map((item) => (
            <FoodItem 
              key={item._id} 
              image={item.image} 
              name={item.name} 
              desc={item.description} 
              price={item.price} 
              id={item._id}
            />
          ))
        ) : (
          <div className='food-display-empty'>
            <p>No dishes found matching "<b>{search}</b>"</p>
            <p className='food-display-empty-sub'>Try searching for a different dish name or clear filters.</p>
            <button type="button" onClick={() => setSearch("")}>Show All Dishes</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default FoodDisplay
