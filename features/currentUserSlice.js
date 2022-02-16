import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userData: {
    id: 'p1',
    username: 'Ben',
    groups: ['groupID1, groupID2'],
    matches: ['match1', 'match2', 'match3'],
  },
};

const userSlice = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {},
});

export const {} = userSlice.actions;
export const selectCurrentUser = (state) => state.currentUser.userData;

export default userSlice.reducer;
