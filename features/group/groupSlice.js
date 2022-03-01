import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../firebase/clientApp';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';

export const getCurrentGroup = createAsyncThunk(
  'groups/getCurrentGroup',
  async (groupPath) => {
    let currentGroupState = {
      id: '',
      name: '',
      path: '',
      matches: [],
      players: {
        core: [],
        reserve: [],
        admin: [],
      },
    };

    const groupDocRef = doc(db, 'groups', groupPath);
    const groupDocSnap = await getDoc(groupDocRef);
    const response = groupDocSnap.data();
    currentGroupState = {
      ...currentGroupState,
      ...response,
    };

    const groupsRef = collection(db, 'group_users');
    const queryCore = query(
      groupsRef,
      where('groupPath', '==', groupPath),
      where('userStatus', '==', 'core')
    );
    const querySnapshotCore = await getDocs(queryCore);
    querySnapshotCore.forEach((doc) => {
      const data = doc.data();
      currentGroupState.players.core.push(data.userId);
    });

    const queryReserve = query(
      groupsRef,
      where('groupPath', '==', groupPath),
      where('userStatus', '==', 'reserve')
    );
    const querySnapshotReserve = await getDocs(queryReserve);
    querySnapshotReserve.forEach((doc) => {
      const data = doc.data();
      currentGroupState.players.reserve.push(data.userId);
    });

    const queryAdmin = query(
      groupsRef,
      where('groupPath', '==', groupPath),
      where('userStatus', '==', 'admin')
    );
    const querySnapshotAdmin = await getDocs(queryAdmin);
    querySnapshotAdmin.forEach((doc) => {
      const data = doc.data();
      currentGroupState.players.admin.push(data.userId);
    });
    return currentGroupState;
  }
);

const initialState = {
  data: {
    id: '',
    name: '',
    path: '',
    matches: [],
    players: {
      core: [],
      reserve: [],
      admin: [],
    },
  },
  isLoading: false,
  failedToLoad: false,
};

export const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCurrentGroup.fulfilled, (state, action) => {
      state.data = action.payload;
      state.failedToLoad = false;
      state.isLoading = false;
    });
    builder.addCase(getCurrentGroup.pending, (state) => {
      state.isLoading = true;
      state.failedToLoad = false;
    });
    builder.addCase(getCurrentGroup.rejected, (state) => {
      state.isLoading = false;
      state.failedToLoad = true;
    });
  },
});

export const {} = groupSlice.actions;
export const selectGroup = (state) => state.group.data;
export const groupIsLoading = (state) => state.group.isLoading;
export const groupFailedToLoad = (state) => state.group.failedToLoad;

export default groupSlice.reducer;
