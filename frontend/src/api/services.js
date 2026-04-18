import api from './axios';

export const authAPI = {
  login: (body) => api.post('/auth/login', body).then((r) => r.data),
  signup: (body) => api.post('/auth/signup', body).then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
};

export const vendorAPI = {
  list: (params = {}) => api.get('/vendors', { params }).then((r) => r.data),
  get: (id) => api.get(`/vendors/${id}`).then((r) => r.data),
  categoryCounts: () => api.get('/vendors/stats/categories').then((r) => r.data),
};

export const productAPI = {
  list: (params = {}) => api.get('/products', { params }).then((r) => r.data),
  get: (id) => api.get(`/products/${id}`).then((r) => r.data),
  mine: () => api.get('/products/mine').then((r) => r.data),
  create: (body) => api.post('/products', body).then((r) => r.data),
  update: (id, body) => api.put(`/products/${id}`, body).then((r) => r.data),
  remove: (id) => api.delete(`/products/${id}`).then((r) => r.data),
};

export const cartAPI = {
  get: () => api.get('/cart').then((r) => r.data),
  add: (productId, quantity = 1) => api.post('/cart', { productId, quantity }).then((r) => r.data),
  update: (productId, quantity) => api.put(`/cart/${productId}`, { quantity }).then((r) => r.data),
  remove: (productId) => api.delete(`/cart/${productId}`).then((r) => r.data),
  clear: () => api.delete('/cart').then((r) => r.data),
};

export const orderAPI = {
  create: (body) => api.post('/orders', body).then((r) => r.data),
  mine: () => api.get('/orders/mine').then((r) => r.data),
  vendor: () => api.get('/orders/vendor').then((r) => r.data),
  all: () => api.get('/orders').then((r) => r.data),
  get: (id) => api.get(`/orders/${id}`).then((r) => r.data),
  updateStatus: (id, status, note) =>
    api.put(`/orders/${id}/status`, { status, note }).then((r) => r.data),
  cancel: (id) => api.put(`/orders/${id}/cancel`).then((r) => r.data),
};

export const requestAPI = {
  list: () => api.get('/requests').then((r) => r.data),
  create: (body) => api.post('/requests', body).then((r) => r.data),
  update: (id, body) => api.put(`/requests/${id}`, body).then((r) => r.data),
};

export const adminAPI = {
  stats: () => api.get('/admin/stats').then((r) => r.data),
  users: (params = {}) => api.get('/admin/users', { params }).then((r) => r.data),
  createUser: (body) => api.post('/admin/users', body).then((r) => r.data),
  updateUser: (id, body) => api.put(`/admin/users/${id}`, body).then((r) => r.data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`).then((r) => r.data),
  toggleStatus: (id, status) => api.put(`/admin/users/${id}/status`, { status }).then((r) => r.data),
};
