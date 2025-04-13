import authReducer from "./slices/authSlice";
import chatReducer from "./slices/chatSlice";
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
  },
});

export default store;
