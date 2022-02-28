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
    builder.addCase(getCurrentGroup.fulfilled, (state, action) => {
      state.byPath[action.payload.path] = {
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
      const groupPath = action.payload.path;
      state.byPath[groupPath].players = action.payload.players;
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

export const {} = groupsSlice.actions;
export const selectIsLoading = (state) => state.groups.isLoading;
export const selectFailedToLoad = (state) => state.groups.failedToLoad;
export const selectGroupsByPath = (state) => state.groups.byPath;

export default groupsSlice.reducer;
