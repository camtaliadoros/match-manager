import { configureStore } from '@reduxjs/toolkit';
import groupReducer from '../features/group/groupSlice';
import matchesReducer from '../features/matches/matchesSlice';
import matchReducer from '../features/matches/matchSlice';
import playersReducer from '../features/users/playersSlice';
import userReducer from '../features/users/userSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    matches: matchesReducer,
    group: groupReducer,
    players: playersReducer,
    match: matchReducer,
  },
});
