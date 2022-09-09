import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { auth, db } from '../../firebase/clientApp';
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
    matches: [],
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

    return updatedDetails;
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

export const getUserMatches = createAsyncThunk(
  'user/getUserMatches',
  async (userId) => {
    const matches = [];

    const userMatchesRef = collection(db, 'user_matches');
    const whereResult = where('playerId', '==', userId);

    const q = query(userMatchesRef, whereResult);

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      matches.push(doc.data());
    });

    return matches;
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
        state.data = {
          ...state.data,
          ...action.payload,
        };
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
    builder.addCase(getUserMatches.fulfilled, (state, action) => {
      state.data.matches = action.payload;
      state.isLoading = false;
      state.failedToLoad = false;
    });
    builder.addCase(getUserMatches.pending, (state) => {
      state.isLoading = true;
      state.failedToLoad = false;
    });
    builder.addCase(getUserMatches.rejected, (state) => {
      state.isLoading = false;
      state.failedToLoad = true;
    });
  },
});
export const { updateUserLoggedIn, updateUserEmail, resetUser, setUser } =
  userSlice.actions;
export const selectCurrentUser = (state) => state.user;
export const selectCurrentUserDetails = createSelector(
  selectCurrentUser,
  (user) => user.data
);

export const userIsLoading = (state) => state.user.isLoading;
export const userFailedToLoad = (state) => state.user.failedToLoad;
export const userIfFulfilled = (state) => state.user.isFulfilled;

export const selectLoggedIn = createSelector(
  selectCurrentUser,
  (user) => user.status.isLoggedIn
);

export const selectEmailVerified = createSelector(
  selectCurrentUser,
  (user) => user.status.isEmailVerified
);

export const selectUserMatches = (state) => state.user.data.matches;

export const selectMatchesRequests = createSelector(
  selectUserMatches,
  (matches) => {
    const result = matches
      .filter((match) => match.playerStatus === 'requested')
      .map((match) => match.matchId);
    return result;
  }
);

export const selectMatchesInvited = createSelector(
  selectUserMatches,
  (matches) => {
    const result = matches
      .filter((match) => match.playerStatus === 'invited')
      .map((match) => match.matchId);
    return result;
  }
);

export const selectMatchesPlaying = createSelector(
  selectUserMatches,
  (matches) => {
    const result = matches
      .filter((match) => match.playerStatus === 'playing')
      .map((match) => match.matchId);
    return result;
  }
);

export const selectMatchesPendingPayment = createSelector(
  selectUserMatches,
  (matches) => {
    const result = matches
      .filter((match) => match.paymentStatus === false)
      .map((match) => match.matchId);
    return result;
  }
);

export default userSlice.reducer;
