// src/services/employeeService.js
import axios from 'axios';

const API_URL = 'https://localhost:5001/api/employee';

export const getEmployees = () => axios.get(`${API_URL}`);
export const getStates = () => axios.get(`${API_URL}/states`);
export const createEmployee = (data) => axios.post(`${API_URL}`, data);
export const updateEmployee = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteEmployee = (id) => axios.delete(`${API_URL}/${id}`);
export const deleteMultipleEmployees = (ids) => axios.post(`${API_URL}/delete-multiple`, ids);
export const downloadPdf = () => axios.get(`${API_URL}/pdf`, { responseType: 'blob' });
export const getReport = () => axios.get(`${API_URL}/report`, { responseType: 'blob' });
