// API service for the furniture application

const API_BASE_URL = 'http://localhost:3001';

// Helper function to handle fetch requests
async function fetchAPI(endpoint, options = {}) {
  // Get token from localStorage if it exists
  const token = localStorage.getItem('furnicraft_token');
  
  // Set default headers
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Authentication
export const authAPI = {
  login: async (email, password) => {
    const response = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    // Store token in localStorage
    if (response.token) {
      localStorage.setItem('furnicraft_token', response.token);
    }
    
    return response;
  },
  
  logout: () => {
    localStorage.removeItem('furnicraft_token');
    localStorage.removeItem('furnicraft_user');
  }
};

// Furniture
export const furnitureAPI = {
  getAllFurniture: () => fetchAPI('/furniture'),
  getFurnitureById: (id) => fetchAPI(`/furniture/${id}`),
  getModels: () => fetchAPI('/3dmodels')
};

// User favorites
export const favoritesAPI = {
  getUserFavorites: (userId) => fetchAPI(`/favorites?userId=${userId}`),
  addToFavorites: (userId, furnitureId) => fetchAPI('/favorites', {
    method: 'POST',
    body: JSON.stringify({ userId, furnitureId })
  }),
  removeFromFavorites: (favoriteId) => fetchAPI(`/favorites/${favoriteId}`, {
    method: 'DELETE'
  })
};

// Shopping cart
export const cartAPI = {
  getUserCart: (userId) => fetchAPI(`/cart?userId=${userId}`),
  addToCart: (userId, furnitureId, quantity) => fetchAPI('/cart', {
    method: 'POST',
    body: JSON.stringify({ userId, furnitureId, quantity })
  }),
  updateCartItem: (cartItemId, quantity) => fetchAPI(`/cart/${cartItemId}`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity })
  }),
  removeFromCart: (cartItemId) => fetchAPI(`/cart/${cartItemId}`, {
    method: 'DELETE'
  })
};

// Room configurations
export const roomConfigAPI = {
  getUserConfigurations: (userId) => fetchAPI(`/configurations?userId=${userId}`),
  getConfigurationById: (id) => fetchAPI(`/configurations/${id}`),
  saveConfiguration: (configData) => fetchAPI('/configurations', {
    method: 'POST',
    body: JSON.stringify(configData)
  }),
  updateConfiguration: (id, configData) => fetchAPI(`/configurations/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(configData)
  }),
  deleteConfiguration: (id) => fetchAPI(`/configurations/${id}`, {
    method: 'DELETE'
  })
};

export default {
  auth: authAPI,
  furniture: furnitureAPI,
  favorites: favoritesAPI,
  cart: cartAPI,
  roomConfig: roomConfigAPI
};
