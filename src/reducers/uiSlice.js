import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { spinner: false },
  reducers: {
    toggleSpinner(state, action) {
      state.spinner = action.payload;
    },
  },
});

export const { toggleSpinner } = uiSlice.actions;
export default uiSlice.reducer;
