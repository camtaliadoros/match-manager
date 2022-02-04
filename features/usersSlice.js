import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  uid: '',
  userStatus: {
    isLoggedIn: false,
    isEmailVerified: false,
  },
  profileDetails: {
    firstName: '',
    lastName: '',
    photo: '',
    emailAddress: '',
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
    resetUser(state) {
      state = initialState;
    },
  },
});
export const {
  updateUserProfile,
  updateUserStatus,
  updateUserId,
  updateEmailVerified,
  resetUser,
} = userSlice.actions;
export const selectLoggedIn = (state) => state.user.userStatus.isLoggedIn;
export const selectEmailVerified = (state) =>
  state.user.userStatus.isEmailVerified;
export const selectUserProfile = (state) => state.user.profileDetails;
export default userSlice.reducer;
