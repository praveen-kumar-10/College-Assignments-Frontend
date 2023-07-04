import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

import { apiSlice } from "./apiSlice";
import { authSlice } from "./auth/authSlice";

import uiReducer from "./uiReducer";
import authReducer from "./auth/authReducer";

export const appReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  [authSlice.reducerPath]: authSlice.reducer,
  auth: authReducer,
  ui: uiReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "USER_LOGOUT") {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware, authSlice.middleware),
});

setupListeners(store.dispatch);

export default store;
