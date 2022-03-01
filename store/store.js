import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/usersSlice';
import matchesReducer from '../features/matches/matchesSlice';
import currentUserReducer from '../features/currentUserSlice';
import groupsReducer from '../features/group/groupsSlice';
import groupReducer from '../features/group/groupSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    matches: matchesReducer,
    currentUser: currentUserReducer,
    group: groupReducer,
    groups: groupsReducer,
  },
});
