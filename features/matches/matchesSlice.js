import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  byId: {
    match1: {
      date: 'Sunday, January 9',
      time: '7pm',
      group: 'groupID1',
      location: 'Sobell Leisure Centre',
      isRecurring: 'Weekly',
      numOfPlayers: 10,
      cost: 7,
      players: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10'],
      waitlist: ['p11', 'p12', 'p13', 'p14'],
    },
    match2: {
      date: 'Sunday, January 9',
      time: '7pm',
      group: 'groupID2',
      location: 'Sobell Leisure Centre',
      isRecurring: 'Weekly',
      numOfPlayers: 10,
      cost: 7,
      players: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10'],
      waitlist: ['p11', 'p12', 'p13', 'p14'],
    },
    match3: {
      date: 'Sunday, January 9',
      time: '7pm',
      group: 'groupID3',
      location: 'Sobell Leisure Centre',
      isRecurring: 'Weekly',
      numOfPlayers: 10,
      cost: 7,
      players: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10'],
      waitlist: ['p11', 'p12', 'p13', 'p14'],
    },
  },
  isLoading: false,
  failedToLoad: false,
};

export const matchesSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {
    createNewMatch: (state, action) => {
      state.byId = action.payload;
    },
  },
});

export const { createNewMatch } = matchesSlice.actions;
export const selectMatches = (state) => {
  return state.matches.byId;
};
export default matchesSlice.reducer;
