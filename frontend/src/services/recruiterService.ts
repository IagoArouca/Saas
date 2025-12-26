import api from './api';

export const recruiterService = {
  getTalents: () => api.get('/recruiters/talents'),
  getTalentById: (id: string) => api.get(`/recruiters/talents/${id}`),
};