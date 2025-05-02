import axios from 'axios';

console.log('Creating axios instance with baseURL:', 'https://aetheron-worker.jassalarjansingh.workers.dev/api');

const api = axios.create({
    baseURL: 'https://aetheron-worker.jassalarjansingh.workers.dev/api',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
    console.log(`Making API request to: ${config.method?.toUpperCase() || 'GET'} ${config.url}`);
    console.log('Request config:', { 
        baseURL: config.baseURL,
        url: config.url, 
        method: config.method,
        headers: config.headers,
        withCredentials: config.withCredentials
    });
    
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Special handling for user profile endpoints
    if (config.url && (config.url.includes('/user') || config.url.includes('/chat'))) {
        console.log('User/chat endpoint detected, ensuring CORS headers are set');
    }
    
    return config;
}, (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
});

// Add response interceptor to handle common errors
api.interceptors.response.use(
    (response) => {
        console.log(`Response received from: ${response.config.method?.toUpperCase() || 'GET'} ${response.config.url}`, {
            status: response.status,
            statusText: response.statusText
        });
        return response;
    },
    (error) => {
        console.error('Response error:', error.message);
        
        // Log detailed error information
        console.error('Error details:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data
        });
        
        if (error.message === 'Network Error') {
            console.error('CORS or network issue detected');
            // Display a user-friendly message
            alert('Network connection issue. Please try again or contact support if the problem persists.');
        }
        
        if (error.response?.status === 401 || error.response?.status === 403) {
            console.error('Authentication error detected');
            // Clear invalid token
            localStorage.removeItem('authToken');
            localStorage.removeItem('userId');
            localStorage.removeItem('username');
            // Redirect to login
            window.location.href = '/login';
        }
        
        if (error.response?.status === 404) {
            console.error('Resource not found:', error.config?.url);
        }
        
        return Promise.reject(error);
    }
);

export default api;