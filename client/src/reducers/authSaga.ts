import { put, takeEvery, call } from 'redux-saga/effects';
import axios from 'axios';
import { loginStart, loginSuccess, loginFailure, logout } from './authSlice';

function* loginSaga(action: ReturnType<typeof loginStart>): Generator<any, void, any> {
  try {
    // Perform the login API call
    const response = yield call(axios.post, 'http://localhost:5555/api/auth/login', action.payload);
    
    // Dispatch success action with user data
    yield put(loginSuccess(response.data));

    // Save the access_token in the cookie
    const { access_token } = response.data.data;
    Cookies.set('access_token', access_token, { path: '/' });
  } catch (error) {
    // Dispatch failure action with error message
    yield put(loginFailure(error.message));
  }
}

function* logoutSaga(): Generator<any, void, any> {
  try {

    // Perform the logout API call with credentials (replace 'http://localhost:5555/api/auth/logout' with your actual logout API endpoint)
    yield call(axios.post, 'http://localhost:5555/api/auth/logout', { withCredentials: true });

    // Dispatch logout action
    yield put(logout());

    // Remove access_token cookie
    Cookies.remove('access_token');
  } catch (error) {
    // Dispatch failure action with error message
    yield put(loginFailure(error.message));

    // Handle errors if any during logout
    console.error('Error during logout:', error);
  }
}

export function* watchLogin() {
  yield takeEvery(loginStart.type, loginSaga);
}

export function* watchLogout() {
  yield takeEvery(logout.type, logoutSaga);
}
