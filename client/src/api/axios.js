import axios from 'axios';

// Always use production URL
const baseURL = 'https://aetheron-worker.jassalarjansingh.workers.dev';
console.log('Creating axios instance with baseURL:', baseURL);

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
    timeout: 10000, // Reduced timeout to 10 seconds for better UX
    // Add CORS settings
    validateStatus: function (status) {
        return status >= 200 && status < 500; // Accept all responses to handle them properly
    }
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
    console.log(`Making API request to: ${config.method?.toUpperCase() || 'GET'} ${config.url}`);
    
    // Add /api prefix if not already present and not requesting a root endpoint
    if (config.url && !config.url.startsWith('/api') && config.url !== '/') {
        config.url = `/api${config.url}`;
        console.log(`Adjusted URL with /api prefix: ${config.url}`);
    }
    
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
}, (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
});

// Add response interceptor to handle common errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.code === 'ECONNABORTED') {
            console.error('Request timeout');
            return Promise.reject(new Error('Request timed out. Please try again.'));
        }
        
        if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userId');
            window.location.href = '/login';
        }
        
        return Promise.reject(error);
    }
);

export default api;