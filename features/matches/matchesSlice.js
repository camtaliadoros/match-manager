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

export const getUserMatches = createAsyncThunk(
  'matches/getUserMatches',
  async (userId) => {
    const matches = [];
    const q = query(
      collection(db, 'user_matches'),
      where('playerId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      matches.push(doc);
    });

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
    builder.addCase(getUserMatches.fulfilled, (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
      state.failedToLoad = false;
    });
    builder.addCase(getUserMatches.pending, (state) => {
      state.isLoading = true;
      state.failedToLoad = false;
    });
    builder.addCase(getUserMatches.rejected, (state) => {
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

export const selectPendingPaymentMatches = createSelector(
  selectMatches,
  (matches) => {
    const result = matches.filter((match) => match.paymentStatus === false);
    return result;
  }
);

export const selectMatchRequests = createSelector(selectMatches, (matches) => {
  const result = matches.filter((match) => match.playerStatus === 'requested');
  return result;
});

export const selectMatchInvited = createSelector(selectMatches, (matches) => {
  const result = matches.filter((match) => match.playerStatus === 'invited');
  return result;
});

export default matchesSlice.reducer;
