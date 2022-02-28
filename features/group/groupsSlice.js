import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/clientApp';

export const createGroup = createAsyncThunk(
  'groups/createGroup',
  async (groupData) => {
    const id = groupData.id;
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
  byId: {
    // name: '',
    // id: '',
    // matches: [],
    // players: {
    //   core: [
    //     'p2',
    //     'p3',
    //     'p4',
    //     'p5',
    //     'p6',
    //     'p7',
    //     'p8',
    //     'p9',
    //     'p10',
    //     'p11',
    //     'p12',
    //   ],
    //   reserve: ['p13', 'p14', 'p15', 'p16'],
    //   admin: '',
    // },
  },
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
      state.byId[action.payload.id] = {
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
      const gId = action.payload.groupId;
      const uId = action.payload.userId;
      const playerStatusArr = state.byId[gId].players[playerStatus];
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
export const selectGroup = (state) => state.groups.byId;

export default groupsSlice.reducer;
