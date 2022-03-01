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
});

export const {} = groupsSlice.actions;
export const selectIsLoading = (state) => state.groups.isLoading;
export const selectFailedToLoad = (state) => state.groups.failedToLoad;
export const selectGroupsByPath = (state) => state.groups.byPath;

export default groupsSlice.reducer;
