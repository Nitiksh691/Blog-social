// src/auth/reactionStore.js
import { create } from 'zustand';
import api from '../utils/axios';

export const useReactionStore = create((set) => ({
  likes: 0,
  dislikes: 0,

  fetchReactions: async (postId) => {
    try {
      const res = await api.get(`/reactions/${postId}`);
      set({ likes: res.data.likes, dislikes: res.data.dislikes });
    } catch (err) {
      console.error('Fetch reactions failed:', err);
    }
  },

  likePost: async (postId) => {
    try {
      await api.post('/reactions/like', { postId });
      await useReactionStore.getState().fetchReactions(postId);
    } catch (err) {
      console.error('Like failed:', err);
    }
  },

  dislikePost: async (postId) => {
    try {
      await api.post('/reactions/dislike', { postId });
      await useReactionStore.getState().fetchReactions(postId);
    } catch (err) {
      console.error('Dislike failed:', err);
    }
  }
}));
