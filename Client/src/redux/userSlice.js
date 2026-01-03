// BiteRoute / Client / src / redux / userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: localStorage.getItem("userData")
      ? JSON.parse(localStorage.getItem("userData"))
      : null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    clearUserData: (state) => {
      state.userData = null;
      localStorage.removeItem("userData");
    },
  },
});

export const { setUserData } = userSlice.actions;
export default userSlice.reducer;
