import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        firstName: '',
        lastName: '',
        photo: '',
    },
    reducers: {
        setFirstName(state, action) {
            state.firstName = action.payload;
        },
        setLastName(state, action) {
            state.lastName = action.payload;
        },
        setPhoto(state,action) {
            state.photo = action.payload;
        }

    }
})
export const { setFirstName, setLastName, setPhoto } = userSlice.actions;
export default userSlice.reducer;