import api from './api';

export const auth = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }).then(r => r.data),
  register: (email: string, password: string, name?: string) => api.post('/auth/register', { email, password, name }).then(r => r.data),
};
