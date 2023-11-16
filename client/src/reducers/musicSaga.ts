import { PayloadAction } from '@reduxjs/toolkit';
import { put, takeEvery, call } from 'redux-saga/effects';
import axios from 'axios';
import {
  fetchDataStart,
  fetchDataSuccess,
  fetchDataFailure,
  createMusicStart,
  createMusicSuccess,
  createMusicFailure,
  updateMusicStart,
  updateMusicSuccess,
  updateMusicFailure,
  deleteMusicStart,
  deleteMusicSuccess,
  deleteMusicFailure,
} from './musicSlice';


interface MusicFormData {
  _id: string; 
  title: string;
  artist: string;
  album: string;
  genre: string;
  imageFile: File;
  audioFile: File;
}

function* fetchDataSaga(): Generator<any, void, any> {
  try {
    const response = yield call(axios.get, 'https://music-player-s6gw.onrender.com/api/music/allwithstat');
    yield put(fetchDataSuccess(response.data.data));
  } catch (error) {
    yield put(fetchDataFailure(error));
  }
}

function* createMusicSaga(action: PayloadAction<{ musicData: MusicFormData; userId: string }>): Generator<any, void, any> {
  try {
    const { musicData, userId } = action.payload;
    const response = yield call(axios.post, `https://music-player-s6gw.onrender.com/api/music/${userId}`, musicData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    yield put(createMusicSuccess(response.data));
  } catch (error) {
    yield put(createMusicFailure(error));
  }
}

function* updateMusicSaga(action: PayloadAction<{ id: string; musicId: string; formData: MusicFormData }>): Generator<any, void, any> {
  try {
    const { id, musicId, formData } = action.payload;
    const response = yield call(axios.put, `https://music-player-s6gw.onrender.com/api/music/${id}/${musicId}`, formData,{ withCredentials: true });
    
    yield put(updateMusicSuccess(response.data.data));
  } catch (error) {
    yield put(updateMusicFailure(error));
  }
}

function* deleteMusicSaga(action: PayloadAction<{ id: string; musicId: string }>): Generator<any, void, any> {
  try {
    const { id, musicId } = action.payload;
    yield call(axios.delete, `https://music-player-s6gw.onrender.com/api/music/${id}/${musicId}`, { withCredentials: true });

    yield put(deleteMusicSuccess(musicId));
  } catch (error) {
    yield put(deleteMusicFailure(error));
  }
}

export function* watchMusic() {
  yield takeEvery(fetchDataStart.type, fetchDataSaga);
  yield takeEvery(createMusicStart.type, createMusicSaga);
  yield takeEvery(updateMusicStart.type, updateMusicSaga);
  yield takeEvery(deleteMusicStart.type, deleteMusicSaga);
}

