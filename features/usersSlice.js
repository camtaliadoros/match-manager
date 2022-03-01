import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { auth, db } from '../firebase/clientApp';
import {
  doc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';

const initialState = {
  data: {
    id: '',
    emailAddress: '',
    username: '',
    photo: '',
  },
  status: {
    isLoggedIn: false,
    isEmailVerified: false,
  },
  isLoading: false,
  failedToLoad: false,
  isFulfilled: false,
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

export const createUser = createAsyncThunk(
  'user/createUser',
  async (userData) => {
    await setDoc(doc(db, 'users', userData.id), userData);
    return userData;
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserLoggedIn(state, action) {
      state.status.isLoggedIn = action.payload;
    },
    updateUserEmail(state, action) {
      state.data.emailAddress = action.payload;
    },
    setUser(state, action) {
      state.data.id = action.payload.uid;
      state.data.emailAddress = action.payload.email;
      state.status.isEmailVerified = action.payload.emailVerified;
    },
    resetUser() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.data.username = action.payload.username;
        state.data.photo = action.payload.photo;
        state.isLoading = false;
        state.failedToLoad = false;
        state.isFulfilled = true;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.failedToLoad = false;
        state.isFulfilled = false;
      })
      .addCase(updateUserProfile.rejected, (state) => {
        state.isLoading = false;
        state.failedToLoad = true;
        state.isFulfilled = false;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.data = {
          ...state.data,
          ...action.payload,
        };
        state.isLoading = false;
        state.failedToLoad = false;
        state.isFulfilled = true;
      })
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
        state.failedToLoad = false;
        state.isFulfilled = false;
      })
      .addCase(getUserProfile.rejected, (state) => {
        state.isLoading = false;
        state.failedToLoad = true;
        state.isFulfilled = false;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.data = {
          ...state.data,
          ...action.payload,
        };
        state.isLoading = false;
        state.failedToLoad = false;
        state.isFulfilled = true;
      })
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
        state.failedToLoad = false;
        state.isFulfilled = false;
      })
      .addCase(createUser.rejected, (state) => {
        state.isLoading = false;
        state.failedToLoad = true;
        state.isFulfilled = false;
      });
  },
});
export const { updateUserLoggedIn, updateUserEmail, resetUser, setUser } =
  userSlice.actions;
export const selectLoggedIn = (state) => state.user.status.isLoggedIn;
export const selectEmailVerified = (state) => state.user.status.isEmailVerified;
export const userIsLoading = (state) => state.user.isLoading;
export const selectCurrentUser = (state) => state.user.data;
export const userFailedToLoad = (state) => state.user.failedToLoad;
export const userIfFulfilled = (state) => state.user.isFulfilled;
export default userSlice.reducer;
