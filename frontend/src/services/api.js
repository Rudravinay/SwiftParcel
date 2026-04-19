import axios from 'axios'

const api = axios.create({ baseURL: '/api', headers: { 'Content-Type': 'application/json' } })

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sp_token'); localStorage.removeItem('sp_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api

export const authAPI   = {
  register: d => api.post('/auth/register', d),
  login:    d => api.post('/auth/login', d),
  me:       () => api.get('/auth/me'),
}
export const parcelAPI = {
  create:       d      => api.post('/parcels', d),
  getAll:       p      => api.get('/parcels', { params: p }),
  getMine:      p      => api.get('/parcels/my', { params: p }),
  getByTid:     tid    => api.get(`/parcels/track/${tid}`),
  getById:      id     => api.get(`/parcels/${id}`),
  update:       (id,d) => api.put(`/parcels/${id}`, d),
  updateStatus: (id,d) => api.patch(`/parcels/${id}/status`, d),
  delete:       id     => api.delete(`/parcels/${id}`),
}
export const reportAPI = {
  summary:  () => api.get('/reports/summary'),
  monthly:  () => api.get('/reports/monthly'),
  generate: () => api.post('/reports/generate'),
  list:     () => api.get('/reports'),
}
