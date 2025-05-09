import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import instrumentsReducer from "./instruments/instrumentsSlice";
import tradeReducer from "./trade/tradeSlice";

const rootReducer = combineReducers({
  user: userReducer,
  instruments: instrumentsReducer,
  trade: tradeReducer,
});

export default rootReducer;
