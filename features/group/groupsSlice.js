import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/clientApp';

export const createGroup = createAsyncThunk(
  'groups/createGroup',
  async (groupData) => {
    const id = groupData.id;
    await setDoc(doc(db, 'groups', id), groupData);
    // Create new group on database
    // Create new user_group - set as admin
    return groupData;
  }
);

const initialState = {
  byId: {
    name: 'Group 1',
    id: 'group1',
    status: 'admin',
    players: {
      core: [
        'p2',
        'p3',
        'p4',
        'p5',
        'p6',
        'p7',
        'p8',
        'p9',
        'p10',
        'p11',
        'p12',
      ],
      reserve: ['p13', 'p14', 'p15', 'p16'],
      admin: 'p1',
    },
  },
  isLoading: false,
  failedToLoad: false,
};

export const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createGroup.fulfilled, (state, action) => {
      state.byId = action.payload;
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
  },
});

export const {} = groupsSlice.actions;
export const selectIsLoading = (state) => state.groups.isLoading;
export const selectFailedToLoad = (state) => state.groups.failedToLoad;
export const selectGroup = (state) => state.groups.byId;

export default groupsSlice.reducer;
