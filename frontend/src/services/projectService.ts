import api from './api';

export const projectService = {
  getAll: () => api.get('/projects/my-projects'),
  create: (data: any) => api.post('/projects', data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};