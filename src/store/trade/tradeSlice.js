import { createSlice } from "@reduxjs/toolkit";
import { ACTION_TYPES } from "../actionTypes";

const tradeSlice = createSlice({
  name: ACTION_TYPES.INSTRUMENTS,
  initialState: {
    showTradeModal: false,
    selectedTrade: null,
  },
  reducers: {
    setShowTradeModal: (state, action) => {
      if (action.payload.active) {
        state.showTradeModal = action.payload.active;
        state.selectedTrade = action.payload.data;
      } else {
        state.showTradeModal = false;
        state.selectedTrade = null;
      }
    },
  },
});

export const { setShowTradeModal } = tradeSlice.actions;
export default tradeSlice.reducer;
