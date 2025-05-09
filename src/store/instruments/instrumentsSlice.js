import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ACTION_TYPES } from "../actionTypes";
import { getInstruments } from "../../services/userService";

export const normalizeByTradingSymbol = (instruments) => {
  return instruments.reduce((acc, item) => {
    acc[item.tradingsymbol] = item;
    return acc;
  }, {});
};

export const fetchInstruments = createAsyncThunk(
  ACTION_TYPES.FETCH_INSTRUMENTS,
  async (_, { rejectWithValue }) => {
    try {
      const response = await getInstruments();
      return response.data?.items;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const instrumentsSlice = createSlice({
  name: ACTION_TYPES.INSTRUMENTS,
  initialState: {
    instruments: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetInstruments: (state) => {
      state.instruments = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInstruments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstruments.fulfilled, (state, action) => {
        state.loading = false;
        state.instruments = action.payload;
      })
      .addCase(fetchInstruments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetInstruments } = instrumentsSlice.actions;
export default instrumentsSlice.reducer;
