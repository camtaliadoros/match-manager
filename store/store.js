import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/usersSlice';
import matchesReducer from '../features/matches/matchesSlice';
import groupsReducer from '../features/group/groupsSlice';
import groupReducer from '../features/group/groupSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    matches: matchesReducer,
    group: groupReducer,
    groups: groupsReducer,
  },
});
