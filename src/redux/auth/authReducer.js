import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  login: {},
  register: {},
};

export const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthDetails: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    onLogin: (state, action) => ({
      ...state,
      login: { ...state.login, ...action.payload },
    }),
    onRegister: (state, action) => ({
      ...state,
      register: { ...state.register, ...action.payload },
    }),
  },
});

export const { onLogin, onRegister, setAuthDetails } = authReducer?.actions;

export default authReducer.reducer;
