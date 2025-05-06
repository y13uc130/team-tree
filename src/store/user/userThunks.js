import { createAsyncThunk } from '@reduxjs/toolkit';
import { ACTION_TYPES } from '../actionTypes';
import { getUserProfile } from '../../services/userService';

export const fetchUserProfile = createAsyncThunk(
    ACTION_TYPES.FETCH_USER_PROFILE,
  async (userId, { rejectWithValue }) => {
    try {
      const response = await getUserProfile(userId);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
