import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/usersSlice';
import matchesReducer from '../features/matches/matchesSlice';
import currentUserReducer from '../features/currentUserSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    matches: matchesReducer,
    currentUser: currentUserReducer,
  },
});
