import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { db } from '../../firebase/clientApp';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const getPlayersData = createAsyncThunk(
  'players/getPlayersData',
  async (playerIds) => {
    const playersData = {};
    let remainingPlayers = playerIds;

    //Iterates through remaining players array and isolates max 10 players
    while (remainingPlayers.length > 0) {
      const playersToFetch = remainingPlayers.slice(0, 10);
      // Fetches data fot 10 players and adds to playersData obj by ID
      const playersRef = collection(db, 'users');
      const q = query(playersRef, where('id', 'in', playersToFetch));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const playerId = data.id;
        playersData[playerId] = data;
      });
      // Filters players for which data has already been fetched
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

export const playersIsLoading = (state) => state.players.isLoading;
export const playersFailedToLoad = (state) => state.players.failedToLoad;
export const selectPlayers = (state) => state.players.data;
export default playersSlice.reducer;
