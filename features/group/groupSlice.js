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
} from 'firebase/firestore';

export const createGroup = createAsyncThunk(
  'group/createGroup',
  async (newGroup) => {
    const path = newGroup.path;
    const groupData = {
      id: newGroup.id,
      name: newGroup.name,
      path: path,
    };
    await setDoc(doc(db, 'groups', path), groupData);

    const adminData = {
      groupId: newGroup.id,
      groupPath: path,
      userId: newGroup.players.admin[0],
      userStatus: 'admin',
    };

    const docId = `${adminData.groupId}_${adminData.userId}`;

    await setDoc(doc(db, 'group_users', docId), adminData);

    return groupData;
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
        ...action.payload,
      };
      state.isLoading = false;
      state.failedToLoad = false;
      state.isFulfilled = true;
    });
    builder.addCase(createGroup.pending, (state) => {
      state.isLoading = true;
      state.failedToLoad = false;
      state.isFulfilled = false;
    });
    builder.addCase(createGroup.rejected, (state) => {
      state.isLoading = false;
      state.failedToLoad = true;
      state.isFulfilled = false;
    });
    builder.addCase(setGroupPlayer.fulfilled, (state, action) => {
      const playerStatus = action.payload.userStatus;
      const uId = action.payload.userId;
      const playerStatusArr = state.data.players[playerStatus];
      playerStatusArr.push(uId);
      state.isLoading = false;
      state.failedToLoad = false;
      state.isFulfilled = true;
    });
    builder.addCase(setGroupPlayer.pending, (state) => {
      state.isLoading = true;
      state.failedToLoad = false;
      state.isFulfilled = false;
    });
    builder.addCase(setGroupPlayer.rejected, (state, action) => {
      state.isLoading = false;
      state.failedToLoad = true;
      state.isFulfilled = false;
    });
  },
});

export const { resetGroup } = groupSlice.actions;
export const selectGroup = (state) => state.group.data;
export const groupIsLoading = (state) => state.group.isLoading;
export const groupFailedToLoad = (state) => state.group.failedToLoad;
export const groupIsFulfilled = (state) => state.group.isFulfilled;

export default groupSlice.reducer;
