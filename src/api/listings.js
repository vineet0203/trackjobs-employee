import api from './axios';

export const getEmployeeListings = () => api.get('/employee/listings');
