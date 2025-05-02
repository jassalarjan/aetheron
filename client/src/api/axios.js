import axios from 'axios';

const api = axios.create({
    baseURL: 'https://aetheron-worker.jassalarjansingh.workers.dev/api',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
    console.log('Making API request to:', config.url);
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
    (response) => response,
    (error) => {
        console.error('Response error:', error.message);
        
        if (error.message === 'Network Error') {
            console.error('CORS or network issue detected');
            // Display a user-friendly message
            alert('Network connection issue. Please try again or contact support if the problem persists.');
        }
        
        if (error.response?.status === 401 || error.response?.status === 403) {
            // Clear invalid token
            localStorage.removeItem('authToken');
            localStorage.removeItem('userId');
            localStorage.removeItem('username');
            // Redirect to login
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;