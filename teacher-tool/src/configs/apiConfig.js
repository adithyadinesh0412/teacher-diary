// src/config/apiConfig.js
export const API_BASE_URL = 'http://localhost:7070';
export const BASE_URLS = {
  USER_BASE_URL : 'http://localhost:3001',
  PTD_BASE_URL : 'http://localhost:6002',
}
export const APP_BASE_NAMES = {
    USER : 'user',
    PTD : 'ptd'

}
// Function to get the access token from local storage
const getAccessToken = () => {
    return localStorage.getItem('authToken'); // Retrieve the token from local storage
  };
export const API_ENDPOINTS = {
    LOGIN : 'v1/account/login',
    LOGOUT : 'v1/account/logout',
    SEARCH : 'v1/account/search',
    CLASSLIST : 'v1/classes/list',
    CREATECLASS : 'v1/classes/create',
    UPDATECLASS : 'v1/classes/update/',
  USERS: '/users',
  PRODUCTS: '/products',
  ORDERS: '/orders',
};
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'X-auth-token': `bearer ${getAccessToken()}`, 
};

