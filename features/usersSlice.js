import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        firstName: '',
        lastName: '',
        photo: '',
        isLoggedIn: false
    },
    reducers: {
        updateUserProfile(state, action) {
            state.firstName = action.payload;
        }
    }
})
export const { updateUserProfile } = userSlice.actions;
export const selectLoggedIn = state => state.user.isLoggedIn;
export const selectUserProfile = state => state.user;
export default userSlice.reducer;