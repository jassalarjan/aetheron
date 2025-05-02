import axios from 'axios';

// Use a more flexible base URL without the /api suffix
const baseURL = 'https://aetheron-worker.jassalarjansingh.workers.dev/api';
console.log('Creating axios instance with baseURL:', baseURL);

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
    console.log(`Making API request to: ${config.method?.toUpperCase() || 'GET'} ${config.url}`);
    
    // Add /api prefix if not already present and not requesting a root endpoint
    if (config.url && !config.url.startsWith('/api') && !config.url.startsWith('/user') && config.url !== '/') {
        config.url = `/api${config.url}`;
        console.log(`Adjusted URL with /api prefix: ${config.url}`);
    }
    
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
        console.log('Added authorization token to request');
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
        
        // For 404 errors on /api/ endpoints, try without the /api prefix
        if (error.response?.status === 404 && error.config?.url?.startsWith('/api/')) {
            console.log('Attempting retry without /api prefix');
            const newUrl = error.config.url.replace('/api/', '/');
            return api({
                ...error.config,
                url: newUrl
            });
        }
        
        if (error.message === 'Network Error') {
            console.error('CORS or network issue detected');
            // Display a user-friendly message in the console
            console.error('Network connection issue detected');
        }
        
        if (error.response?.status === 401 || error.response?.status === 403) {
            console.error('Authentication error detected');
            // Clear invalid token
            localStorage.removeItem('authToken');
            localStorage.removeItem('userId');
            // Redirect to login
            window.location.href = '/login';
        }
        
        return Promise.reject(error);
    }
);

export default api;