import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const VERIFY_USER_START = 'VERIFY_USER_START';
export const VERIFY_USER_SUCCESS = 'VERIFY_USER_SUCCESS';
export const VERIFY_USER_FAILURE = 'VERIFY_USER_FAILURE';

interface UserDetails {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  music: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserDetails | null;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ data: { details: UserDetails; access_token: string } }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.data.details;
      localStorage.setItem('user', JSON.stringify(state.user));
      console.log('loginSuccess:', state.user);

      const { access_token } = action.payload.data;
      document.cookie = `access_token=${access_token}; path=/`;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      localStorage.removeItem('user');
    },
    verifyUserStart: (state) => {
      console.log('verifyUserStart:');
      state.error = null;
    },
    verifyUserSuccess: (state) => {
      state.isAuthenticated = true;
      console.log('verifyUserSuccess:');
    },
    verifyUserFailure: (state, action: PayloadAction<string>) => {
      console.log('verifyUserFailure:');
      state.isAuthenticated = false;
      state.error = action.payload;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, verifyUserStart, verifyUserSuccess, verifyUserFailure } = authSlice.actions;
export default authSlice.reducer;
