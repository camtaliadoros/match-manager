import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { db } from '../../firebase/clientApp';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const getPlayersData = createAsyncThunk(
  'players/getPlayersData',
  async (playerIds) => {
    const playersData = {};
    let remainingPlayers = playerIds;

    while (remainingPlayers.length > 0) {
      const playersToFetch = remainingPlayers.slice(0, 10);

      const playersRef = collection(db, 'users');
      const q = query(playersRef, where('id', 'in', playersToFetch));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const userId = data.id;
        playersData[userId] = data;
      });

      remainingPlayers = remainingPlayers.filter((id) => {
        return !playersToFetch.includes(id);
      });
    }

    return playersData;
  }
);

const initialState = {
  data: {},
  isLoading: false,
  failedToLoad: false,
};

const playersSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPlayersData.fulfilled, (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
      state.failedToLoad = false;
    });
    builder.addCase(getPlayersData.pending, (state) => {
      state.isLoading = true;
      state.failedToLoad = false;
    });
    builder.addCase(getPlayersData.rejected, (state) => {
      state.isLoading = false;
      state.failedToLoad = true;
    });
  },
});

export const {} = playersSlice.actions;

export const playersIsLoading = (state) => state.players.isLoading;
export const playersFailedToLoad = (state) => state.players.failedToLoad;
export const selectPlayers = (state) => state.players.data;
export default playersSlice.reducer;
