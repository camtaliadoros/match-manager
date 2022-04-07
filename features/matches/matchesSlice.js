import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/clientApp';

export const getGroupMatches = createAsyncThunk(
  'matches/getGroupMatches',
  async (groupId) => {
    const result = {};
    const matchesRef = collection(db, 'matches');
    const q = query(matchesRef, where('group', '==', groupId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      result[doc.id] = doc.data();
    });
    return result;
  }
);

const initialState = {
  byId: {},
  isLoading: false,
  failedToLoad: false,
};

export const matchesSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getGroupMatches.fulfilled, (state, action) => {
      state.byId = action.payload;
      state.isLoading = false;
      state.failedToLoad = false;
    });
    builder.addCase(getGroupMatches.pending, (state) => {
      state.isLoading = true;
      state.failedToLoad = false;
    });
    builder.addCase(getGroupMatches.rejected, (state) => {
      state.isLoading = false;
      state.failedToLoad = true;
    });
  },
});

export const { createNewMatch } = matchesSlice.actions;
export const selectMatches = (state) => {
  return state.matches.byId;
};
export default matchesSlice.reducer;
