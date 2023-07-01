import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

const API_URL = 'https://localhost:7037/api/User';

let userFromToken = null;
const token = localStorage.getItem('token');

if (token) {
    try {
        const decoded = jwt_decode(token);
        userFromToken = { username: decoded.unique_name, id: decoded.nameid };
    } catch (error) {
        console.log('Error decoding token', error);
    }
}

// Initial state
const initialState = {
    user: userFromToken,
    status: 'idle',
    error: null
};

// Async action
export const loginUser = createAsyncThunk(
    'user/login',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/login`, userData);
            // Store JWT token on login success in browser's local storage
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            const decoded = jwt_decode(response.data.token);
            const user = { username: decoded.unique_name, id: decoded.nameid };
            return { token: response.data.token, user }; // return user in the payload
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const registerUser = createAsyncThunk(
    'user/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/register`, userData);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            localStorage.removeItem('token'); // Remove the token from local storage on logout
        },
        startRegistration: (state) => {
            state.status = 'idle';
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user;
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
    },
});

export const { logout, startRegistration, clearError } = userSlice.actions;

export default userSlice.reducer;