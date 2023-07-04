import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  currentStudentAssignmentsTab: "pending",
};

export const uiReducer = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setIsLoading: (state, action) => ({
      ...state,
      isLoading: action.payload,
    }),
    setCurrentStudentAssignmentsTab: (state, action) => ({
      ...state,
      currentStudentAssignmentsTab: action?.payload,
    }),
  },
});

export const { setIsLoading, setCurrentStudentAssignmentsTab } =
  uiReducer.actions;

export default uiReducer.reducer;
