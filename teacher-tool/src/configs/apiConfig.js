// src/config/apiConfig.js
export const API_BASE_URL = 'http://localhost:7070';
export const APP_BASE_NAMES = {
    USER : 'user'

}
// Function to get the access token from local storage
const getAccessToken = () => {
    return localStorage.getItem('authToken'); // Retrieve the token from local storage
  };
export const API_ENDPOINTS = {
    LOGIN : 'v1/account/login',
    LOGOUT : 'v1/account/logout',
  USERS: '/users',
  PRODUCTS: '/products',
  ORDERS: '/orders',
};
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getAccessToken()}`, 
};

