import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        login: {
            currentUser: null,
            isLoading: false,
            error: false,
        },
        register: {
            isLoading: false,
            error: false,
            success: false,
        },
    },
    reducers: {
        // Login
        loginStart: (state) => {
            state.login.isLoading = true;
        },
        loginSuccess: (state, action) => {
            state.login.isLoading = false;
            state.login.currentUser = action.payload;
            state.login.error = false;
        },
        loginFailed: (state) => {
            state.login.isLoading = false;
            state.login.currentUser = null;
            state.login.error = true;
        },

        // Register
        registerStart: (state) => {
            state.register.isLoading = true;
        },
        registerSuccess: (state) => {
            state.register.isLoading = false;
            state.register.error = false;
            state.register.success = true;
        },
        registerFailed: (state) => {
            state.register.isLoading = false;
            state.register.error = true;
            state.register.success = false;
        },
        // Logout
        logOutSuccess: (state) => {
            state.login.isLoading = false;
            state.login.currentUser = null;
            state.login.error = false;
        },
        logOutFailed: (state) => {
            state.login.isLoading = false;
            state.login.error = true;
        },
        logOutStart: (state) => {
            state.login.isLoading = true;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginStart, (state) => {
                state.login.isLoading = true;
            })
            .addCase(loginSuccess, (state) => {
                state.login.isLoading = false;
            })
            .addCase(loginFailed, (state) => {
                state.login.isLoading = false;
            })
            .addCase(logOutStart, (state) => {
                state.login.isLoading = true;
            })
            .addCase(logOutSuccess, (state) => {
                state.login.isLoading = false;
            })
            .addCase(logOutFailed, (state) => {
                state.login.isLoading = false;
            });
    },
});

export const {
    loginStart,
    loginSuccess,
    loginFailed,
    fetchArticlesSuccess,
    registerStart,
    registerSuccess,
    registerFailed,
    logOutStart,
    logOutSuccess,
    logOutFailed,
} = authSlice.actions;

export default authSlice.reducer;
