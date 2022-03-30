import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/clientApp';

const initialState = {
  data: {},
  isLoading: false,
  failedToLoad: false,
};

export const createMatch = createAsyncThunk(
  'match/createMatch',
  async (matchData) => {
    const docRef = await addDoc(collection(db, 'matches'), {
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
  },
});

export const {} = matchSlice.actions;

export default matchSlice.reducer;
