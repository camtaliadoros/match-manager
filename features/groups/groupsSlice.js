import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { db } from '../../firebase/clientApp';
import { collection, query, where, getDocs } from 'firebase/firestore';

const initialState = {
  data: [],
  isLoading: false,
  failedToLoad: false,
};

export const getGroupsById = createAsyncThunk(
  'groups/getGroupsById',
  async (groupIds) => {
    const groups = [];
    let remainingGroups = groupIds;

    //Iterates through remaining groups array and isolates max 10 matches
    while (remainingGroups.length > 0) {
      const groupsToFetch = remainingGroups.slice(0, 10);
      // Fetches data fot 10 groups and adds to groups arr
      const groupsRef = collection(db, 'groups');
      const q = query(groupsRef, where('id', 'in', groupsToFetch));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        groups.push(doc.data());
      });
      // Filters groups for which data has already been fetched
      remainingGroups = remainingGroups.filter((id) => {
        return !groupsToFetch.includes(id);
      });
    }

    return groups;
  }
);

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getGroupsById.fulfilled, (state, action) => {
      state.data = action.payload;
      state.failedToLoad = false;
      state.isLoading = false;
    });
    builder.addCase(getGroupsById.pending, (state) => {
      state.isLoading = true;
      state.failedToLoad = false;
    });
    builder.addCase(getGroupsById, (state) => {
      state.isLoading = false;
      state.failedToLoad = true;
    });
  },
});

export const selectGroups = (state) => state.groups.data;

export const selectGroupsFailedToLoad = (state) => state.groups.failedToLoad;

export const selectGroupsIsLoading = (state) => state.groups.isLoading;

export default groupsSlice.reducer;
