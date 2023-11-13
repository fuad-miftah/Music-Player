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

interface AuthState {
  isAuthenticated: boolean;
  user: UserDetails | null; // Adjusted to be an object or null
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<any>) => {
      state.isAuthenticated = true;
      state.user = action.payload.data.details;
      localStorage.setItem('user', JSON.stringify(state.user));
      console.log("loginSuccess: ", state.user);

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
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
