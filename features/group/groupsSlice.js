import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { db } from '../../firebase/clientApp';

export const createGroup = createAsyncThunk(
  'groups/createGroup',
  async (groupData) => {
    const id = groupData.path;
    await setDoc(doc(db, 'groups', id), groupData);

    return groupData;
  }
);

export const setGroupPlayer = createAsyncThunk(
  'groups/setGroupPlayer',
  async (playerData) => {
    const group = playerData.groupId;
    const user = playerData.userId;
    const docId = `${group}_${user}`;
    await setDoc(doc(db, 'group_users', docId), playerData);
    return playerData;
  }
);

const initialState = {
  byPath: {},
  isLoading: false,
  failedToLoad: false,
  errorMessage: '',
};

export const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createGroup.fulfilled, (state, action) => {
      state.byPath[action.payload.path] = {
        ...action.payload,
        matches: [],
        players: {
          core: [],
          reserve: [],
          admin: [],
        },
      };
      state.isLoading = false;
      state.failedToLoad = false;
    });
    builder.addCase(createGroup.pending, (state) => {
      state.isLoading = true;
      state.failedToLoad = false;
    });
    builder.addCase(createGroup.rejected, (state) => {
      state.isLoading = false;
      state.failedToLoad = true;
    });
    builder.addCase(setGroupPlayer.fulfilled, (state, action) => {
      const playerStatus = action.payload.userStatus;
      const gPath = action.payload.groupPath;
      const uId = action.payload.userId;
      const playerStatusArr = state.byPath[gPath].players[playerStatus];
      playerStatusArr.push(uId);
      state.isLoading = false;
      state.failedToLoad = false;
    });
    builder.addCase(setGroupPlayer.pending, (state) => {
      state.isLoading = true;
      state.failedToLoad = false;
    });
    builder.addCase(setGroupPlayer.rejected, (state, action) => {
      state.isLoading = false;
      state.failedToLoad = true;
      state.errorMessage = action.payload;
    });
  },
});

export const {} = groupsSlice.actions;
export const selectIsLoading = (state) => state.groups.isLoading;
export const selectFailedToLoad = (state) => state.groups.failedToLoad;
export const selectGroupsByPath = (state) => state.groups.byPath;

export default groupsSlice.reducer;
