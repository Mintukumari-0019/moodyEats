import axios from 'axios';
import { food_list as defaultFoodList } from '../assets/assets';

const STORAGE_KEY_CUSTOM = 'moodyeats_custom_foods';
const STORAGE_KEY_DELETED = 'moodyeats_deleted_ids';
const STORAGE_KEY_UPDATED = 'moodyeats_updated_foods';

export const getLocalCustomFoods = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_CUSTOM) || '[]');
  } catch (e) {
    return [];
  }
};

export const getLocalDeletedIds = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_DELETED) || '[]');
  } catch (e) {
    return [];
  }
};

export const getLocalUpdatedFoods = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_UPDATED) || '[]');
  } catch (e) {
    return [];
  }
};

/**
 * Merges default foods, backend foods, and local foods into a single unified list.
 */
export const mergeFoods = (backendFoods = []) => {
  const customFoods = getLocalCustomFoods();
  const deletedIds = new Set(getLocalDeletedIds().map(String));
  const updatedFoods = getLocalUpdatedFoods();
  const updatedMap = new Map(updatedFoods.map(u => [String(u._id || u.id), u]));

  const map = new Map();

  // 1. Load default food items (32 items)
  for (const item of defaultFoodList) {
    map.set(String(item._id), { ...item });
  }

  // 2. Merge backend foods if any
  for (const item of backendFoods) {
    map.set(String(item._id), { ...item });
  }

  // 3. Merge custom local foods (added from Admin)
  for (const item of customFoods) {
    map.set(String(item._id), { ...item });
  }

  // 4. Apply updates / edits
  for (const [id, update] of updatedMap.entries()) {
    if (map.has(id)) {
      map.set(id, { ...map.get(id), ...update });
    }
  }

  // 5. Filter out deleted items
  const result = [];
  for (const [id, item] of map.entries()) {
    if (!deletedIds.has(id)) {
      result.push(item);
    }
  }

  return result;
};

/**
 * Fetches foods from backend if available, merging seamlessly with default & local items.
 * Never fails if backend is offline.
 */
export const fetchAllFoods = async (apiUrl = 'http://localhost:4000') => {
  let backendFoods = [];
  try {
    const res = await axios.get(`${apiUrl}/api/food/list`, { timeout: 3500 });
    if (res.data && res.data.success && Array.isArray(res.data.data)) {
      backendFoods = res.data.data;
    }
  } catch (err) {
    console.info("MoodyEats backend is offline or unreachable. Using persistent local menu:", err.message);
  }
  return mergeFoods(backendFoods);
};

/**
 * Subscribes to cross-tab / cross-frame updates from Admin panel
 */
export const subscribeToFoodUpdates = (callback) => {
  if (typeof window === 'undefined') return () => {};

  const handleStorage = (e) => {
    if (e.key === STORAGE_KEY_CUSTOM || e.key === STORAGE_KEY_DELETED || e.key === STORAGE_KEY_UPDATED) {
      callback();
    }
  };

  let bc = null;
  try {
    bc = new BroadcastChannel('moodyeats_sync_channel');
    bc.onmessage = (e) => {
      if (e.data && e.data.type === 'FOODS_UPDATED') {
        callback();
      }
    };
  } catch (err) {
    // broadcastchannel fallback
  }

  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener('storage', handleStorage);
    if (bc) {
      bc.close();
    }
  };
};
