import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase/clientApp';
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';

const initialState = {
  uid: '',
  emailAddress: '',
  userStatus: {
    isLoggedIn: false,
    isEmailVerified: false,
  },
  profile: {
    displayName: '',
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
    const userID = auth.currentUser.uid;
    await updateDoc(doc(db, 'users', userID), updatedDetails);

    return {
      username: updatedDetails.displayName,
      photo: updatedDetails.photoURL,
    };
  }
);

export const getUserProfile = createAsyncThunk(
  'user/getUserProfile',
  async (userId) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('id', '==', userId));
    const queryResult = await getDocs(q);
    let result;

    queryResult.forEach((doc) => {
      result = doc.data();
    });

    return result;
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserStatus(state, action) {
      state.userStatus.isLoggedIn = action.payload;
    },
    updateUserEmail(state, action) {
      state.emailAddress = action.payload;
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
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.status.isLoading = false;
        state.status.failedToLoad = false;
      })
      .addCase(getUserProfile.pending, (state) => {
        state.status.isLoading = true;
        state.status.failedToLoad = false;
      })
      .addCase(getUserProfile.rejected, (state) => {
        state.status.isLoading = false;
        state.status.failedToLoad = true;
      });
  },
});
export const { updateUserStatus, updateUserEmail, resetUser, setUser } =
  userSlice.actions;
export const selectLoggedIn = (state) => state.user.userStatus.isLoggedIn;
export const selectEmailVerified = (state) =>
  state.user.userStatus.isEmailVerified;
export const selectLoading = (state) => state.user.status.isLoading;
export const selectCurrentUser = (state) => state.user;
export const selectError = (state) => state.user.errorMessage;
export default userSlice.reducer;
