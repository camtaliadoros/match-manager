import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: {},
  isLoading: false,
  failedToLoad: false,
};

const matchSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {},
});

export const {} = matchSlice.actions;

export default matchSlice.reducer;
