import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../../firebase/clientApp';

export const createGroup = createAsyncThunk(
  'group/createGroup',
  async (newGroup) => {
    const groupId = newGroup.groupData.id;
    const groupData = newGroup.groupData;

    await setDoc(doc(db, 'groups', groupId), groupData);

    const adminData = {
      groupId: groupId,
      playerId: newGroup.adminId,
      playerStatus: 'admin',
    };

    const docId = `${adminData.groupId}_${adminData.playerId}`;

    await setDoc(doc(db, 'group_users', docId), adminData);

    return newGroup;
  }
);

export const addGroupPlayer = createAsyncThunk(
  'group/addGroupPlayer',
  async (playerData) => {
    const group = playerData.groupId;
    const user = playerData.playerId;
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
      players: [],
    };

    const groupsRef = collection(db, 'groups');
    const q = query(groupsRef, where('path', '==', groupPath));
    let response;

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      response = doc.data();
    });

    currentGroupState = {
      ...currentGroupState,
      ...response,
    };

    const groupPlayersRef = collection(db, 'group_users');
    const queryPlayers = query(
      groupPlayersRef,
      where('groupId', '==', currentGroupState.id)
    );
    const queryPlayersSnapshot = await getDocs(queryPlayers);
    queryPlayersSnapshot.forEach((doc) => {
      const data = doc.data();
      currentGroupState.players.push({
        playerId: data.playerId,
        playerStatus: data.playerStatus,
      });
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
      playerStatus: newStatus,
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

export const updateGroupName = createAsyncThunk(
  'group/updateGroupName',
  async (groupToUpdate) => {
    const groupId = groupToUpdate.groupId;
    const newName = groupToUpdate.newGroupName;
    const newPath = groupToUpdate.newPath;

    const groupRef = doc(db, 'groups', groupId);
    await updateDoc(groupRef, {
      name: newName,
      path: newPath,
    });

    return {
      newName,
      newPath,
    };
  }
);

export const getGroupMatches = createAsyncThunk(
  'group/getGroupMatches',
  async (groupId) => {
    const matchesArr = [];
    const matchesRef = collection(db, 'matches');
    const q = query(matchesRef, where('groupId', '==', groupId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      matchesArr.push(doc.data());
    });
    return matchesArr;
  }
);

const initialState = {
  data: {
    id: '',
    name: '',
    path: '',
    matches: [],
    players: [],
    isAdmin: false,
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
    setIsAdmin(state, action) {
      state.data.isAdmin = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCurrentGroup.fulfilled, (state, action) => {
      state.data = {
        ...state.data,
        ...action.payload,
      };
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
    builder.addCase(addGroupPlayer.fulfilled, (state, action) => {
      state.data.players.push(action.payload);
      state.isLoading = false;
      state.failedToLoad = false;
    });
    builder.addCase(addGroupPlayer.pending, (state) => {
      state.isLoading = true;
      state.failedToLoad = false;
    });
    builder.addCase(addGroupPlayer.rejected, (state) => {
      state.isLoading = false;
      state.failedToLoad = true;
    });
    builder.addCase(updatePlayerStatus.fulfilled, (state, action) => {
      const player = state.data.players.find(
        (player) => player.playerId === action.payload.playerId
      );
      player.playerStatus = action.payload.playerStatus;
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
      state.data.players = state.data.players.filter(
        (player) => player.playerId !== action.payload.playerId
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
    builder.addCase(updateGroupName.fulfilled, (state, action) => {
      state.data.name = action.payload.newName;
      state.data.path = action.payload.newPath;
      state.isLoading = false;
      state.failedToLoad = false;
    });
    builder.addCase(updateGroupName.pending, (state) => {
      state.isLoading = true;
      state.failedToLoad = false;
    });
    builder.addCase(updateGroupName.rejected, (state) => {
      state.isLoading = false;
      state.failedToLoad = true;
    });
    builder.addCase(getGroupMatches.fulfilled, (state, action) => {
      state.data.matches = action.payload;
      state.isLoading = false;
      state.failedToLoad = false;
    });
    builder.addCase(getGroupMatches, (state) => {
      state.isLoading = true;
      state.failedToLoad = false;
    });
    builder.addCase(getGroupMatches.rejected, (state) => {
      state.isLoading = false;
      state.failedToLoad = true;
    });
  },
});

export const { resetGroup, setIsAdmin } = groupSlice.actions;
export const selectGroup = (state) => state.group.data;
export const selectGroupPlayers = createSelector(
  selectGroup,
  (group) => group.players
);
export const selectGroupPlayersByStatus = createSelector(
  selectGroupPlayers,
  (groupPlayers) => {
    const playerStatus = {
      core: [],
      reserve: [],
      admin: [],
      requested: [],
    };
    if (groupPlayers) {
      for (const player of groupPlayers) {
        playerStatus[player.playerStatus].push(player.playerId);
      }
    }

    return playerStatus;
  }
);
export const groupIsLoading = (state) => state.group.isLoading;
export const groupFailedToLoad = (state) => state.group.failedToLoad;
export const selectUserIsAdmin = (state) => state.group.data.isAdmin;

export default groupSlice.reducer;
