import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

interface LoginResponseData {
  success: string;
  message: string;
  data: {
    details: UserDetails;
    role: string;
    access_token: string;
  };
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
    loginStart: (state, action: PayloadAction<{ username: string; password: string }>) => {
      state.error = null;
      console.log(action.payload);
    },
    loginSuccess: (state, action: PayloadAction<LoginResponseData>) => {
      state.isAuthenticated = true;
      state.user = action.payload.data.details;
      localStorage.setItem('user', JSON.stringify(state.user));

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
    verifyUserStart: (state, action: PayloadAction<{ _id: string; }>) => {
      console.log(action.payload);
      state.error = null;
    },
    verifyUserSuccess: (state) => {
      state.isAuthenticated = true;
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
