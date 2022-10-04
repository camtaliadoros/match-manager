import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import moment from 'moment';
import { db } from '../../firebase/clientApp';
import { matchBatchDelete } from '../../utilities/helpers';

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
      querySnapshot.forEach(async (result) => {
        const matchData = result.data();

        const dateNow = Date.now();

        // Checks if match date is past
        if (dateNow > matchData.timestamp) {
          if (matchData.isRecurring) {
            const newDate = moment(matchData.timestamp).add(7, 'd').format('x');

            matches.push({ ...matchData, timestamp: newDate });
            await updateDoc(doc(db, 'matches', matchData.id), {
              timestamp: newDate,
            });
          } else {
            matchBatchDelete(matchData.id);
          }
        } else {
          matches.push(matchData);
        }
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
