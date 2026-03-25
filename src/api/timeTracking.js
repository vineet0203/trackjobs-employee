import api from './axios';

export const getDashboard = () => api.get('/employee/dashboard');

export const checkIn = (payload) => api.post('/employee/check-in', payload);

export const checkOut = (payload) => api.post('/employee/check-out', payload);

export const breakStart = () => api.post('/employee/break-start');

export const breakEnd = () => api.post('/employee/break-end');

export const getTimeEntries = (page = 1, perPage = 5) =>
  api.get('/employee/time-entries', {
    params: {
      page,
      per_page: perPage,
    },
  });

export const updateTimeEntry = (id, payload) =>
  api.put(`/employee/time-entry/${id}`, payload);
