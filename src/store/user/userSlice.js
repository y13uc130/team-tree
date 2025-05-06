import { createSlice } from '@reduxjs/toolkit';
import { fetchUserProfile } from './userThunks';
import { ACTION_TYPES } from '../actionTypes';

const userSlice = createSlice({
  name: ACTION_TYPES.USER,
  initialState: {
    profile: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetUser: (state) => {
      state.profile = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetUser } = userSlice.actions;
export default userSlice.reducer;
