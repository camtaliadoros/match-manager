import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../firebase/clientApp';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

export const createGroup = createAsyncThunk(
  'group/createGroup',
  async (newGroup) => {
    const path = newGroup.groupData.path;
    const groupData = newGroup.groupData;

    await setDoc(doc(db, 'groups', path), groupData);

    const adminData = {
      groupId: newGroup.groupData.id,
      groupPath: path,
      userId: newGroup.adminId,
      userStatus: 'admin',
    };

    const docId = `${adminData.groupId}_${adminData.userId}`;

    await setDoc(doc(db, 'group_users', docId), adminData);

    return newGroup;
  }
);

export const setGroupPlayer = createAsyncThunk(
  'group/setGroupPlayer',
  async (playerData) => {
    const group = playerData.groupId;
    const user = playerData.userId;
    const docId = `${group}_${user}`;
    await setDoc(doc(db, 'group_users', docId), playerData);
    return playerData;
  }
);

export const getCurrentGroup = createAsyncThunk(
  'group/getCurrentGroup',
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
        requested: [],
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

    const queryRequested = query(
      groupsRef,
      where('groupPath', '==', groupPath),
      where('userStatus', '==', 'requested')
    );
    const querySnapshotRequested = await getDocs(queryRequested);
    querySnapshotRequested.forEach((doc) => {
      const data = doc.data();
      currentGroupState.players.requested.push(data.userId);
    });

    return currentGroupState;
  }
);

export const updatePlayerStatus = createAsyncThunk(
  'group/updatePlayerStatus',
  async (updatedData) => {
    const groupId = updatedData.groupId;
    const playerId = updatedData.playerId;
    const newStatus = updatedData.playerStatus;

    const docId = `${groupId}_${playerId}`;

    const playerRef = doc(db, 'group_users', docId);
    await updateDoc(playerRef, {
      userStatus: newStatus,
    });

    return updatedData;
  }
);

export const removeGroupPlayer = createAsyncThunk(
  'group/removeGroupPlayer',
  async (playerToRemove) => {
    const groupId = playerToRemove.groupId;
    const playerId = playerToRemove.playerId;
    const docId = `${groupId}_${playerId}`;

    await deleteDoc(doc(db, 'group_users', docId));

    return playerToRemove;
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
      requested: [],
    },
  },
  isFulfilled: false,
  isLoading: false,
  failedToLoad: false,
};

export const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    resetGroup() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCurrentGroup.fulfilled, (state, action) => {
      state.data = action.payload;
      state.failedToLoad = false;
      state.isLoading = false;
      state.isFulfilled = true;
    });
    builder.addCase(getCurrentGroup.pending, (state) => {
      state.isLoading = true;
      state.failedToLoad = false;
      state.isFulfilled = false;
    });
    builder.addCase(getCurrentGroup.rejected, (state) => {
      state.isLoading = false;
      state.failedToLoad = true;
      state.isFulfilled = false;
    });
    builder.addCase(createGroup.fulfilled, (state, action) => {
      state.data = {
        ...state.data,
        ...action.payload.groupData,
      };
      state.data.players.admin = [action.payload.adminId];
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
      const uId = action.payload.userId;
      const playerStatusArr = state.data.players[playerStatus];
      playerStatusArr.push(uId);
      state.isLoading = false;
      state.failedToLoad = false;
    });
    builder.addCase(setGroupPlayer.pending, (state) => {
      // state.isLoading = true;
      state.failedToLoad = false;
    });
    builder.addCase(setGroupPlayer.rejected, (state) => {
      state.isLoading = false;
      state.failedToLoad = true;
    });
    builder.addCase(updatePlayerStatus.fulfilled, (state, action) => {
      state.data.players.core = state.data.players.core.filter(
        (id) => id !== action.payload.playerId
      );
      state.data.players.reserve = state.data.players.reserve.filter(
        (id) => id !== action.payload.playerId
      );
      state.data.players.requested = state.data.players.requested.filter(
        (id) => id !== action.payload.playerId
      );
      state.data.players[action.payload.playerStatus].push(
        action.payload.playerId
      );
      state.isLoading = false;
      state.failedToLoad = false;
    });
    builder.addCase(updatePlayerStatus.pending, (state) => {
      state.failedToLoad = false;
    });
    builder.addCase(updatePlayerStatus.rejected, (state) => {
      state.isLoading = false;
      state.failedToLoad = true;
    });
    builder.addCase(removeGroupPlayer.fulfilled, (state, action) => {
      state.data.players.core = state.data.players.core.filter(
        (id) => id !== action.payload.playerId
      );
      state.data.players.reserve = state.data.players.reserve.filter(
        (id) => id !== action.payload.playerId
      );
      state.data.players.requested = state.data.players.requested.filter(
        (id) => id !== action.payload.playerId
      );
      state.data.players.admin = state.data.players.admin.filter(
        (id) => id !== action.payload.playerId
      );
      state.isLoading = false;
      state.failedToLoad = false;
    });
    builder.addCase(removeGroupPlayer.pending, (state) => {
      state.failedToLoad = false;
    });
    builder.addCase(removeGroupPlayer.rejected, (state) => {
      state.isLoading = false;
      state.failedToLoad = true;
    });
  },
});

export const { resetGroup } = groupSlice.actions;
export const selectGroup = (state) => state.group.data;
export const groupIsLoading = (state) => state.group.isLoading;
export const groupFailedToLoad = (state) => state.group.failedToLoad;
export const groupIsFulfilled = (state) => state.group.isFulfilled;

export default groupSlice.reducer;
