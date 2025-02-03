// src/services/apiService.js
import { BASE_URLS , DEFAULT_HEADERS, API_ENDPOINTS , APP_BASE_NAMES} from '../configs/apiConfig'
import axios from 'axios';

const apiService = {
    async request(endpoint, appName, method = 'GET', data = null, addHeader = true) {
        const APP = APP_BASE_NAMES[`${appName}`];
        const API_BASE_URL = BASE_URLS[`${appName}_BASE_URL`]
        const url = `${API_BASE_URL}/${APP}/${endpoint}`;
    
        // Axios configuration
        const config = {
          method, // HTTP method (GET, POST, etc.)
          url,    // Full URL
          data,   // Request body (for POST, PUT, etc.)
        };
    
        // Add headers if required
        if (addHeader) {
          config.headers = DEFAULT_HEADERS;
        }
    
        try {
          const response = await axios(config);

          if(response.status == 401){
            logout()
          }
          return response.data; // Axios automatically parses the response data
        } catch (error) {
          console.error('API request failed:', error);
    
          // Handle error response (if available)
          if (error.response) {
            // The request was made, but the server responded with a non-2xx status code
            console.error('Error response data:', error.response.data);
            console.error('Error status:', error.response.status);
            console.error('Error headers:', error.response.headers);
            throw new Error(error.response.data.message || 'Something went wrong');
          } else if (error.request) {
            // The request was made, but no response was received
            console.error('No response received:', error.request);
            throw new Error('No response received from the server');
          } else {
            // Something happened in setting up the request
            console.error('Request setup error:', error.message);
            throw new Error('Request setup failed');
          }
        }
      },
    

  // Example API methods
  getUsers() {
    return this.request(API_ENDPOINTS.USERS);
  },

  login(userData) {
    return this.request(API_ENDPOINTS.LOGIN,'USER', 'POST', userData , false);
  },
  logout() {
    const refreshToken = getRefreshToken()
    // Save the token or user data to local storage (if applicable)
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('name');

    
    return this.request(API_ENDPOINTS.LOGOUT,'USER', 'POST', {
        refresh_token : refreshToken
    } , true);
  },
  
  createUser(userData) {
    return this.request(API_ENDPOINTS.USERS, 'POST', userData);
  },
  async searchUsers(userData,params) {
    const url = API_ENDPOINTS.SEARCH + params
    const res = await this.request(url,'USER' , 'POST', userData,true);
    return res
  },

  async getClassList() {
    const url = API_ENDPOINTS.CLASSLIST
    const res = await this.request(url,'PTD' , 'GET', {},true);
    return res
  },
  async createClass(userData) {
    const url = API_ENDPOINTS.CREATECLASS
    const res = await this.request(url,'PTD' , 'POST', userData,true);
    return res
  },
  async updateClass(userData) {
    const url = API_ENDPOINTS.UPDATECLASS + userData.id
    const res = await this.request(url,'PTD' , 'POST', {
      name : userData.name
    },true);
    return res
  },

  getProducts() {
    return this.request(API_ENDPOINTS.PRODUCTS);
  },

  // Add more methods as needed
};

export default apiService;


function getRefreshToken(){
    return localStorage.getItem('refreshToken'); // Retrieve the token from local storage

}