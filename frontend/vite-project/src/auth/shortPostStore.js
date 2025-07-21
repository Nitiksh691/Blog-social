// src/store/shortPostStore.js
import { create } from 'zustand';
import api from '../utils/axios';

export const useShortPostStore = create((set) => ({
  loading: false,
  error: null,
  shortPosts: [],

  createShortPost: async (data) => {
    try {
      set({ loading: true, error: null });
  
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.content);
      formData.append('hashtag', data.hashtag);
      formData.append('type', data.type);
      if (data.media) {
        formData.append('media', data.media);
      }
  
      const res = await api.post('/shortposts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
  
      set((state) => ({
        shortPosts: [res.data, ...state.shortPosts],
        loading: false,
      }));
  
      return res.data; // ✅ return to clear form in frontend
    } catch (err) {
      console.error('Short post creation failed:', err);
      set({ error: err.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },
  

  fetchShortPosts: async () => {
    try {
      set({ loading: true });
      const res = await api.get('/shortposts');
      set({ shortPosts: res.data, loading: false });
    } catch (err) {
      console.error('Failed to fetch short posts:', err);
      set({ error: err.message, loading: false });
    }
  },
}));
