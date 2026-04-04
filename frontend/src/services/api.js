import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ai-powered-system-for-document-extraction.onrender.com',
});

// Since it's a hackathon, we can hardcode the dev key or let the user supply it.
// Here we set a default key that matches the backend default.
const API_KEY = '123456';

api.interceptors.request.use((config) => {
  config.headers['x-api-key'] = API_KEY;
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const processDocument = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/process/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const chatWithDocument = async (query) => {
  const response = await api.post('/chat/', { query });
  return response.data;
};

export default api;
