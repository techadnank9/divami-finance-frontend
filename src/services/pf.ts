import api from './api';

export const tx = {
  create: (payload: any) => api.post('/transactions', payload).then((r: any) => r.data),
  list: (params: any = {}) => api.get('/transactions', { params }).then((r: any) => r.data),
  update: (id: string, body: any) => api.put('/transactions/' + id, body).then((r: any) => r.data),
  del: (id: string) => api.delete('/transactions/' + id).then((r: any) => r.data),
  sumByMonth: (year: number, month: number) => api.get('/transactions/summary', { params: { year, month } }).then((r: any) => r.data).catch(() => null),
  byCategory: (year: number, month: number) => api.get('/transactions/by-category', { params: { year, month } }).then((r: any) => r.data).catch(() => null),
};

export const budgets = {
  create: (payload: any) => api.post('/budgets', payload).then((r: any) => r.data),
  list: (params: any) => api.get('/budgets', { params }).then((r: any) => r.data),
  update: (id: string, body: any) => api.put('/budgets/' + id, body).then((r: any) => r.data),
  del: (id: string) => api.delete('/budgets/' + id).then((r: any) => r.data),
};
