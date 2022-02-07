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
    updateUserStatus(state, action) {
      state.userStatus.isLoggedIn = action.payload;
    },
    setUser(state, action) {
      state.uid = action.payload.uid;
      state.emailAddress = action.payload.email;
      state.userStatus.isLoggedIn = true;
      state.userStatus.isEmailVerified = action.payload.emailVerified;
      state.profileDetails.profileName = action.payload.displayName;
      state.profileDetails.photo = action.payload.photoURL;
    },
    resetUser() {
      return initialState;
    },
  },
});
export const { updateUserStatus, resetUser, setUser } = userSlice.actions;
export const selectLoggedIn = (state) => state.user.userStatus.isLoggedIn;
export const selectEmailVerified = (state) =>
  state.user.userStatus.isEmailVerified;
export const selectCurrentUser = (state) => state.user;
export default userSlice.reducer;
