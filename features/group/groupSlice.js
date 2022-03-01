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
    const docRef = doc(db, 'groups', groupPath);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  }
);

export const getGroupPlayers = createAsyncThunk(
  'groups/getGroupPlayers',
  async (groupPath) => {
    const groupPlayers = {
      path: groupPath,
      players: {
        core: [],
        reserve: [],
        admin: [],
      },
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
      groupPlayers.players.core.push(data.userId);
    });

    const queryReserve = query(
      groupsRef,
      where('groupPath', '==', groupPath),
      where('userStatus', '==', 'reserve')
    );
    const querySnapshotReserve = await getDocs(queryReserve);
    querySnapshotReserve.forEach((doc) => {
      const data = doc.data();
      groupPlayers.players.reserve.push(data.userId);
    });

    const queryAdmin = query(
      groupsRef,
      where('groupPath', '==', groupPath),
      where('userStatus', '==', 'admin')
    );
    const querySnapshotAdmin = await getDocs(queryAdmin);
    querySnapshotAdmin.forEach((doc) => {
      const data = doc.data();
      groupPlayers.players.admin.push(data.userId);
    });

    return groupPlayers;
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
      state.data = {
        ...action.payload,
        matches: [],
        players: {
          core: [],
          reserve: [],
          admin: [],
        },
      };
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
    builder.addCase(getGroupPlayers.fulfilled, (state, action) => {
      state.data.players = action.payload.players;
      state.isLoading = false;
      state.failedToLoad = false;
    });
    builder.addCase(getGroupPlayers.pending, (state) => {
      state.isLoading = true;
      state.failedToLoad = false;
    });
    builder.addCase(getGroupPlayers.rejected, (state, action) => {
      state.isLoading = false;
      state.failedToLoad = true;
      // state.errorMessage = action.payload;
    });
  },
});

export const {} = groupSlice.actions;
export const selectGroup = (state) => state.group.data;
export const groupIsLoading = (state) => state.group.isLoading;
export const groupFailedToLoad = (state) => state.group.failedToLoad;

export default groupSlice.reducer;
