import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        users: {
            allUsers: null,
            isFetching: false,
            error: false,
        },
    },
    reducers: {
        // GET
        getUserStart: (state) => {
            state.users.isFetching = true;
        },
        getUserSuccess: (state, action) => {
            state.users.isFetching = false;
            state.users.allUsers = action.payload;
        },
        getUserFailed: (state) => {
            state.users.isFetching = false;
            state.users.isFetching = true;
        },

        // DELETE
        deleteUserStart: (state) => {
            state.users.isFetching = true;
        },
        deleteUserSuccess: (state, action) => {
            state.users.isFetching = false;
            state.users.allUsers = state.users.allUsers.filter(
                (user) => user._id !== action.payload,
            );
        },
        deleteUserFailed: (state) => {
            state.users.isFetching = false;
            state.users.error = true;
        },

        // PUT
        putUserStart: (state) => {
            state.users.isFetching = true;
        },
        putUserSuccess: (state, action) => {
            state.users.isFetching = false;
            state.users.allUsers = state.users.allUsers.map((user) =>
                user._id === action.payload._id ? action.payload : user,
            );
        },
        putUserFailed: (state) => {
            state.users.isFetching = false;
            state.users.error = true;
        },
    },
});

export const {
    getUserStart,
    getUserSuccess,
    getUserFailed,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailed,
    putUserStart,
    putUserSuccess,
    putUserFailed,
} = userSlice.actions;

export default userSlice.reducer;
