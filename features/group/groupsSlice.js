import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { startAfter } from 'firebase/firestore';

export const createGroup = createAsyncThunk(
  'groups/createGroup',
  async (groupData) => {
    // Create new group on database
    // Create new user_group - set as admin
    return groupData;
  }
);

const initialState = {
  byId: {
    name: 'Group 1',
    id: 'group1',
    status: 'admin',
  },
  isLoading: false,
  failedToLoad: false,
};

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createGroup.fulfilled, (state, action) => {
      state.byId = action.payload;
    });
    builder.addCase(createGroup.pending, (state) => {
      state.isLoading = true;
      state.failedToLoad = false;
    });
    builder.addCase(createGroup.rejected, (state) => {
      state.isLoading = false;
      state.failedToLoad = true;
    });
  },
});

export const {} = groupsSlice.actions;
export const selectIsLoading = (state) => state.groups.isLoading;
export const selectFailedToLoad = (state) => state.groups.failedToLoad;
export const selectGroup = (state) => state.groups.byId;

export default groupsSlice.reducer;
