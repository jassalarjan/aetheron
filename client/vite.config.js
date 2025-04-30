import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    },
  },
})

// Add JSDoc type definitions for Web Speech API
/**
 * @typedef {Object} SpeechRecognitionEvent
 * @property {Array} results - The recognition results
 */

/**
 * @typedef {Object} SpeechRecognition
 * @property {boolean} continuous - Whether recognition is continuous
 * @property {boolean} interimResults - Whether to return interim results
 * @property {string} lang - The language to use for recognition
 * @property {Function} start - Start recognition
 * @property {Function} stop - Stop recognition
 * @property {Function} onstart - Called when recognition starts
 * @property {Function} onresult - Called when results are available
 * @property {Function} onerror - Called when an error occurs
 * @property {Function} onend - Called when recognition ends
 */

// Extend the Window interface using JSDoc
/**
 * @typedef {Object} Window
 * @property {typeof SpeechRecognition} webkitSpeechRecognition - WebKit Speech Recognition API
 * @property {typeof SpeechRecognition} SpeechRecognition - Standard Speech Recognition API
 */