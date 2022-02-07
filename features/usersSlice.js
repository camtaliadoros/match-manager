import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  uid: '',
  emailAddress: '',
  userStatus: {
    isLoggedIn: false,
    isEmailVerified: false,
  },
  profileDetails: {
    profileName: '',
    photo: '',
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserProfile(state, action) {
      state.profileDetails = action.payload;
    },
    updateUserStatus(state, action) {
      state.userStatus.isLoggedIn = action.payload;
    },
    updateEmailVerified(state, action) {
      state.userStatus.isEmailVerified = action.payload;
    },
    updateUserId(state, action) {
      state.uid = action.payload;
    },
    updateEmailAddress(state, action) {
      state.emailAddress = action.payload;
    },
    resetUser() {
      return initialState;
    },
  },
});
export const {
  updateUserProfile,
  updateUserStatus,
  updateUserId,
  updateEmailVerified,
  updateEmailAddress,
  resetUser,
} = userSlice.actions;
export const selectLoggedIn = (state) => state.user.userStatus.isLoggedIn;
export const selectEmailVerified = (state) =>
  state.user.userStatus.isEmailVerified;
export const selectCurrentUser = (state) => state.user;
export default userSlice.reducer;
