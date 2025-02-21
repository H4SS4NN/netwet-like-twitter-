
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; 


export const loginService = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data; // { token, user }
};


export const signupService = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data; // { token, user }
};


export const logoutService = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
