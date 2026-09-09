import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeTab: "home",
};

const classroomSlice = createSlice({
  name: "classroom",
  initialState,
  reducers: {
    setClassroomTab: (state, action) => {
      state.activeTab = action.payload ?? "home";
    },
    clearClassroomState: () => initialState,
  },
});

export const { setClassroomTab, clearClassroomState } = classroomSlice.actions;

export default classroomSlice.reducer;
