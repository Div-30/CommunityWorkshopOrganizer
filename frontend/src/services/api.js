const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5272/api';

const apiFetch = async (endpoint, options = {}) => {
  const rawToken = localStorage.getItem('token');
  const token = (rawToken && rawToken !== 'null' && rawToken !== 'undefined') ? rawToken : null;
  if (rawToken && !token) localStorage.removeItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  if (response.status === 401) {
    const authHeaderDetail = response.headers.get('WWW-Authenticate');
    localStorage.removeItem('token');
    throw new Error('UNAUTHORIZED_401: ' + (authHeaderDetail || 'No details provided by server'));
  }
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Something went wrong');
  }
  if (response.status === 204) return null;
  return response.json();
};

export const authAPI = {
  login: (email, password) =>
    apiFetch('/Auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (email, password, fullName, userRole) =>
    apiFetch('/User', { method: 'POST', body: JSON.stringify({ email, password, fullName, userRole }) }),
  getCurrentUser: () => apiFetch('/User/profile'),
};

export const workshopAPI = {
  getAll: (status) => apiFetch('/Workshop' + (status ? `?status=${status}` : '')),
  getMyWorkshops: () => apiFetch('/Workshop/my'),
  getById: (id) => apiFetch(`/Workshop/${id}`),
  create: (data) => apiFetch('/Workshop', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/Workshop/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/Workshop/${id}`, { method: 'DELETE' }),
  approve: (id) => apiFetch(`/Workshop/${id}/approve`, { method: 'PUT' }),
  reject: (id, reason) =>
    apiFetch(`/Workshop/${id}/reject`, { method: 'PUT', body: JSON.stringify({ reason }) }),
};

export const registrationAPI = {
  register: (workshopId) =>
    apiFetch('/Registration', { method: 'POST', body: JSON.stringify(workshopId) }),
  getMyRegistrations: () => apiFetch('/Registration/my'),
  cancel: (id) => apiFetch(`/Registration/${id}`, { method: 'DELETE' }),
  getWorkshopAttendees: (workshopId) => apiFetch(`/Registration/workshop/${workshopId}`),
};

export const organizerRequestAPI = {
  submitRequest: (message) =>
    apiFetch('/OrganizerRequest', { method: 'POST', body: JSON.stringify({ message }) }),
  getAll: (status) => apiFetch('/OrganizerRequest' + (status ? `?status=${status}` : '')),
  approve: (id) => apiFetch(`/OrganizerRequest/${id}/approve`, { method: 'PUT' }),
  reject: (id, reason) =>
    apiFetch(`/OrganizerRequest/${id}/reject`, { method: 'PUT', body: JSON.stringify({ reason }) }),
};

export const userAPI = {
  getAll: () => apiFetch('/User'),
  getProfile: () => apiFetch('/User/profile'),
  updateProfile: (fullName, password) =>
    apiFetch('/User/profile', { method: 'PUT', body: JSON.stringify({ fullName, password }) }),
  deleteUser: (id) => apiFetch(`/User/${id}`, { method: 'DELETE' }),
};

export const resourceAPI = {
  getByWorkshop: (workshopId) => apiFetch(`/Resource/workshop/${workshopId}`),
  add: (workshopId, title, resourceUrl) =>
    apiFetch('/Resource', { method: 'POST', body: JSON.stringify({ workshopId, title, resourceUrl }) }),
  delete: (id) => apiFetch(`/Resource/${id}`, { method: 'DELETE' }),
};

export default apiFetch;
