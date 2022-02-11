import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { updateEmail, updatePassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase/clientApp';

const initialState = {
  uid: '',
  emailAddress: '',
  userStatus: {
    isLoggedIn: false,
    isEmailVerified: false,
  },
  profile: {
    name: '',
    photo: '',
  },
  status: {
    isLoading: false,
    failedToLoad: false,
  },
  errorMessage: '',
};

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (updatedDetails) => {
    const updated = await updateProfile(auth.currentUser, {
      displayName: updatedDetails.displayName,
      photoURL: updatedDetails.photoURL,
    });
    return {
      name: auth.currentUser.displayName,
      photo: auth.currentUser.photoURL,
    };
  }
);

export const updateUserEmail = createAsyncThunk(
  'user/updateUserEmail',
  async (newEmailAddress) => {
    try {
      await updateEmail(auth.currentUser, newEmailAddress);
      return auth.currentUser.email;
    } catch (error) {
      state.errorMessage = error;
    }
  }
);

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
      state.profile.name = action.payload.displayName;
      state.profile.photo = action.payload.photoURL;
    },
    resetUser() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.status.isLoading = false;
        state.status.failedToLoad = false;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.status.isLoading = true;
        state.status.failedToLoad = false;
      })
      .addCase(updateUserProfile.rejected, (state) => {
        state.status.isLoading = false;
        state.status.failedToLoad = true;
      })
      .addCase(updateUserEmail.fulfilled, (state, action) => {
        state.emailAddress = action.payload;
        state.status.isLoading = false;
        state.status.failedToLoad = false;
      })
      .addCase(updateUserEmail.pending, (state) => {
        state.status.isLoading = true;
        state.status.failedToLoad = false;
      })
      .addCase(updateUserEmail.rejected),
      (state) => {
        state.status.isLoading = false;
        state.status.failedToLoad = true;
      };
  },
});
export const { updateUserStatus, resetUser, setUser } = userSlice.actions;
export const selectLoggedIn = (state) => state.user.userStatus.isLoggedIn;
export const selectEmailVerified = (state) =>
  state.user.userStatus.isEmailVerified;
export const selectCurrentUser = (state) => state.user;
export default userSlice.reducer;
