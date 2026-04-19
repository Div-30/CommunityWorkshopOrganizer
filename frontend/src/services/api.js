const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    return;
  }
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Something went wrong');
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const authAPI = {
  login: (email, password) =>
    apiFetch('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (email, password, fullName, role) =>
    apiFetch('/users/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName, role }),
    }),
  getCurrentUser: () => apiFetch('/users/me'),
};

export const workshopAPI = {
  getAll: () => apiFetch('/workshops'),
  getById: (id) => apiFetch(`/workshops/${id}`),
  create: (data) =>
    apiFetch('/workshops', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiFetch(`/workshops/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiFetch(`/workshops/${id}`, {
      method: 'DELETE',
    }),
};

export const registrationAPI = {
  register: (workshopId) =>
    apiFetch('/registrations', {
      method: 'POST',
      body: JSON.stringify({ workshopId }),
    }),
  getMyRegistrations: () => apiFetch('/registrations/my'),
  cancel: (id) =>
    apiFetch(`/registrations/${id}`, {
      method: 'DELETE',
    }),
  getWorkshopAttendees: (workshopId) => apiFetch(`/registrations/workshop/${workshopId}`),
};

export default apiFetch;
