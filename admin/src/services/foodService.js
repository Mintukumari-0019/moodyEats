import axios from 'axios';
import { url, frontendUrl, defaultFoodList } from '../assets/assets';

const STORAGE_KEY_CUSTOM = 'moodyeats_custom_foods';
const STORAGE_KEY_DELETED = 'moodyeats_deleted_ids';
const STORAGE_KEY_UPDATED = 'moodyeats_updated_foods';

/**
 * Compresses an image File or Data URL to lightweight JPEG Data URL (30-60KB)
 * to prevent browser localStorage quota errors.
 */
export const compressImage = (file, maxWidth = 500, maxHeight = 500, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    if (typeof file === 'string') return resolve(file);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

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

// Singleton iframe reference for cross-origin sync with frontend (port 5173)
let syncFrame = null;
let isSyncReady = false;

export const initSync = () => {
  if (typeof window === 'undefined') return;

  if (!syncFrame) {
    let frame = document.getElementById('moodyeats-sync-frame');
    if (!frame) {
      frame = document.createElement('iframe');
      frame.id = 'moodyeats-sync-frame';
      frame.src = `${frontendUrl}/sync.html`;
      frame.style.display = 'none';
      frame.style.position = 'fixed';
      frame.style.width = '0';
      frame.style.height = '0';
      frame.style.border = 'none';
      document.body.appendChild(frame);
    }
    syncFrame = frame;

    window.addEventListener('message', (event) => {
      const data = event.data;
      if (!data || typeof data !== 'object') return;

      if (data.type === 'MOODYEATS_SYNC_READY' || data.type === 'MOODYEATS_DATA_RESPONSE') {
        isSyncReady = true;
        // Merge any custom foods found in frontend storage into admin's storage
        if (Array.isArray(data.customFoods) && data.customFoods.length > 0) {
          const currentCustom = getLocalCustomFoods();
          const currentMap = new Map(currentCustom.map(f => [String(f._id), f]));
          let changed = false;
          for (const item of data.customFoods) {
            if (!currentMap.has(String(item._id))) {
              currentMap.set(String(item._id), item);
              changed = true;
            }
          }
          if (changed) {
            localStorage.setItem(STORAGE_KEY_CUSTOM, JSON.stringify(Array.from(currentMap.values())));
          }
        }
      }
    });
  }
};

export const syncToFrontend = () => {
  try {
    initSync();
    if (syncFrame && syncFrame.contentWindow) {
      const customFoods = getLocalCustomFoods();
      const deletedIds = getLocalDeletedIds();
      const updatedFoods = getLocalUpdatedFoods();

      syncFrame.contentWindow.postMessage({
        type: 'MOODYEATS_SAVE_DATA',
        customFoods,
        deletedIds,
        updatedFoods
      }, '*');
    }
  } catch (e) {
    console.warn('[Sync] Could not post to frontend sync frame:', e.message);
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

  // 1. Load default food items (the 32 frontend items)
  for (const item of defaultFoodList) {
    map.set(String(item._id), { ...item });
  }

  // 2. Merge backend foods
  for (const item of backendFoods) {
    map.set(String(item._id), { ...item });
  }

  // 3. Merge custom local foods
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
 * Never throws error when backend is offline!
 */
export const fetchAllFoods = async () => {
  let backendFoods = [];
  try {
    const res = await axios.get(`${url}/api/food/list`, { timeout: 3500 });
    if (res.data && res.data.success && Array.isArray(res.data.data)) {
      backendFoods = res.data.data;
    }
  } catch (err) {
    // Backend offline is expected and handled gracefully
    console.info("MoodyEats backend is offline or unreachable. Using persistent local menu:", err.message);
  }
  return mergeFoods(backendFoods);
};

/**
 * Add a new food item.
 * Tries backend first; if backend is offline or fails, saves locally and syncs to frontend.
 */
export const addFood = async ({ name, description, price, category, imageFile }) => {
  const compressedImg = await compressImage(imageFile);

  const localItem = {
    _id: "custom_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
    name: name.trim(),
    description: (description || "").trim(),
    price: Number(price),
    category,
    image: compressedImg,
    isCustom: true,
    createdAt: new Date().toISOString()
  };

  let backendSuccess = false;
  let backendData = null;

  try {
    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", (description || "").trim());
    formData.append("price", Number(price));
    formData.append("category", category);
    formData.append("image", imageFile);

    const res = await axios.post(`${url}/api/food/add`, formData, { timeout: 4000 });
    if (res.data && res.data.success) {
      backendSuccess = true;
      backendData = res.data.data;
      if (backendData && backendData._id) {
        localItem._id = backendData._id;
      }
    }
  } catch (err) {
    console.info("Backend offline or error while adding. Persisting locally:", err.message);
  }

  // Save to local custom foods
  const customs = getLocalCustomFoods();
  customs.unshift(localItem);
  localStorage.setItem(STORAGE_KEY_CUSTOM, JSON.stringify(customs));

  // If item was previously in deletedIds, un-delete it
  const deleted = getLocalDeletedIds().filter(id => String(id) !== String(localItem._id));
  localStorage.setItem(STORAGE_KEY_DELETED, JSON.stringify(deleted));

  // Sync to frontend iframe
  syncToFrontend();

  return {
    success: true,
    message: backendSuccess 
      ? 'Food item added and published successfully!' 
      : 'Food item added successfully! (Active for both Admin & Frontend)',
    data: localItem,
    isLocal: !backendSuccess
  };
};

/**
 * Remove food item by ID.
 * Works for both default items and custom added items, with or without backend.
 */
export const removeFood = async (id, name = '') => {
  const strId = String(id);

  // Try backend deletion if online
  try {
    await axios.post(`${url}/api/food/remove`, { id }, { timeout: 3000 });
  } catch (err) {
    console.info("Backend offline or error while removing:", err.message);
  }

  // Remove from custom foods
  const customs = getLocalCustomFoods().filter(item => String(item._id) !== strId);
  localStorage.setItem(STORAGE_KEY_CUSTOM, JSON.stringify(customs));

  // Add to deletedIds list
  const deleted = Array.from(new Set([...getLocalDeletedIds(), strId]));
  localStorage.setItem(STORAGE_KEY_DELETED, JSON.stringify(deleted));

  // Sync to frontend
  syncToFrontend();

  return {
    success: true,
    message: `"${name || 'Dish'}" removed from the menu.`
  };
};

/**
 * Update food item.
 * Works for both default items and custom added items, with or without backend.
 */
export const updateFood = async ({ id, name, description, price, category, imageFile, currentImage }) => {
  const strId = String(id);
  let updatedImg = currentImage;

  if (imageFile) {
    updatedImg = await compressImage(imageFile);
  }

  const updatePayload = {
    _id: strId,
    name: name.trim(),
    description: (description || "").trim(),
    price: Number(price),
    category,
    image: updatedImg
  };

  // Try backend update if online
  try {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("name", updatePayload.name);
    formData.append("description", updatePayload.description);
    formData.append("price", updatePayload.price);
    formData.append("category", updatePayload.category);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    await axios.post(`${url}/api/food/update`, formData, { timeout: 4000 });
  } catch (err) {
    console.info("Backend offline or error while updating:", err.message);
  }

  // Update in custom foods if present
  const customs = getLocalCustomFoods();
  const customIdx = customs.findIndex(item => String(item._id) === strId);
  if (customIdx !== -1) {
    customs[customIdx] = { ...customs[customIdx], ...updatePayload };
    localStorage.setItem(STORAGE_KEY_CUSTOM, JSON.stringify(customs));
  } else {
    // Add to updatedFoods list
    const updates = getLocalUpdatedFoods().filter(u => String(u._id) !== strId);
    updates.push(updatePayload);
    localStorage.setItem(STORAGE_KEY_UPDATED, JSON.stringify(updates));
  }

  // Sync to frontend
  syncToFrontend();

  return {
    success: true,
    message: 'Food item updated successfully!',
    data: updatePayload
  };
};
