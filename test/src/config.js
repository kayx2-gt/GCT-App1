// src/config.js
const hostname = window.location.hostname;

// Always use same host as frontend, backend is just on port 3001
const API_URL = `http://${hostname}:3001`;

export default API_URL;

