import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/clientApp';

const initialState = {
  data: {},
  isLoading: false,
  failedToLoad: false,
};

export const createMatch = createAsyncThunk(
  'match/createMatch',
  async (matchData) => {
    const docRef = await setDoc(doc(db, 'matches', matchData.id), {
      id: matchData.id,
      title: matchData.title,
      date: Date.parse(`${matchData.date} ${matchData.time}`),
      group: matchData.group,
      isPublic: matchData.isPublic,
      isRecurring: matchData.isRecurring,
      location: matchData.location,
      numOfPlayers: matchData.numOfPlayers,
      cost: matchData.cost,
    });

    return matchData;
  }
);

export const getCurrentMatch = createAsyncThunk(
  'match/getCurrentMatch',
  async (matchId) => {
    const docRef = doc(db, 'matches', matchId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw `There was a problem finding the match you're looking for.`;
    }
  }
);

const matchSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createMatch.fulfilled, (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
      state.failedToLoad = false;
    });
    builder.addCase(createMatch.pending, (state) => {
      state.isLoading = true;
      state.failedToLoad = false;
    });
    builder.addCase(createMatch.rejected, (state) => {
      state.isLoading = false;
      state.failedToLoad = true;
    });
    builder.addCase(getCurrentMatch.fulfilled, (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
      state.failedToLoad = false;
    });
    builder.addCase(getCurrentMatch.pending, (state) => {
      state.isLoading = true;
      state.failedToLoad = false;
    });
    builder.addCase(getCurrentMatch.rejected, (state) => {
      state.failedToLoad = true;
      state.isLoading = false;
    });
  },
});

export const {} = matchSlice.actions;
export const selectCurrentMatch = (state) => state.match.data;
export const selectMatchIsLoading = (state) => state.match.isLoading;

export default matchSlice.reducer;
