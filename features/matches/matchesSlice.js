import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/clientApp';

export const getGroupMatches = createAsyncThunk(
  'matches/getGroupMatches',
  async (groupId) => {
    const result = [];
    const matchesRef = collection(db, 'matches');
    const q = query(matchesRef, where('groupId', '==', groupId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      result.push(doc.data());
    });
    return result;
  }
);

export const getMatchesById = createAsyncThunk(
  'matches/getMatchesById',
  async (matchIds) => {
    const matches = [];
    let remainingMatches = matchIds;

    //Iterates through remaining matches array and isolates max 10 matches
    while (remainingMatches.length > 0) {
      const matchesToFetch = remainingMatches.slice(0, 10);
      // Fetches data fot 10 matches and adds to matches arr
      const matchesRef = collection(db, 'matches');
      const q = query(matchesRef, where('id', 'in', matchesToFetch));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        matches.push(doc.data());
      });
      // Filters matches for which data has already been fetched
      remainingMatches = remainingMatches.filter((id) => {
        return !matchesToFetch.includes(id);
      });
    }

    return matches;
  }
);

const initialState = {
  data: [],
  isLoading: false,
  failedToLoad: false,
};

export const matchesSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getGroupMatches.fulfilled, (state, action) => {
      state.data = action.payload;
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
    builder.addCase(getMatchesById.fulfilled, (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
      state.failedToLoad = false;
    });
    builder.addCase(getMatchesById.pending, (state) => {
      state.isLoading = true;
      state.failedToLoad = false;
    });
    builder.addCase(getMatchesById.rejected, (state) => {
      state.isLoading = false;
      state.failedToLoad = true;
    });
  },
});

export const { createNewMatch } = matchesSlice.actions;
export const selectMatches = (state) => {
  return state.matches.data;
};

export const selectSortedMatches = createSelector(selectMatches, (matches) => {
  return [...matches].sort((matchA, matchB) => {
    return matchA.timestamp - matchB.timestamp;
  });
});

export default matchesSlice.reducer;
