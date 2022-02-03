import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userProfile/usersSlice';

export default configureStore({
  reducer: {
    user: userReducer,
  },
});
