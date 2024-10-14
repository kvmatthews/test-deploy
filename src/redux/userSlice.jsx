import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoggedIn: false,
    profile: {},
    token: '',
    registrationStatus: null, // Menyimpan status registrasi
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.isLoggedIn = true;
            state.token = action.payload.token;
            state.profile = action.payload.profile;
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.token = '';
            state.profile = {};
        },
        registerSuccess: (state, action) => {
            state.registrationStatus = 'success';
            state.profile = action.payload;
        },
        registerFailure: (state) => {
            state.registrationStatus = 'failed';
        },
    },
});

export const { loginSuccess, logout, registerSuccess, registerFailure } = userSlice.actions;
export default userSlice.reducer;
