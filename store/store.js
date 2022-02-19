import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/usersSlice';
import matchesReducer from '../features/matches/matchesSlice';
import currentUserReducer from '../features/currentUserSlice';
import groupsReducer from '../features/group/groupsSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    matches: matchesReducer,
    currentUser: currentUserReducer,
    groups: groupsReducer,
  },
});
