import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        uid: '',
        isLoggedIn: false,
        profileDetails: {
            firstName: '',
            lastName: '',
            photo: '',
        }
    },
    reducers: {
        updateUserProfile(state, action) {
            state.profileDetails = action.payload;
        },
        updateUserStatus(state, action) {
            state.isLoggedIn = action.payload;
        },
        updateUserId(state, action) {
            state.uid = action.payload;
        }
    }
})
export const { updateUserProfile, updateUserStatus, updateUserId } = userSlice.actions;
export const selectLoggedIn = state => state.user.isLoggedIn;
export const selectUserProfile = state => state.user;
export default userSlice.reducer;