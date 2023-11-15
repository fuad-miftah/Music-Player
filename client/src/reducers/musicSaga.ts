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

interface CoverImage {
  public_id: string;
  url: string;
}

interface Audio {
  public_id: string;
  url: string;
}

interface MusicListItem {
  coverImg: CoverImage;
  audio: Audio;
  _id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  user: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface MusicFormData {
  _id: string; // Assuming this is the ID for the music entry, adjust it based on your actual data model
  title: string;
  artist: string;
  album: string;
  genre: string;
  imageFile: File;
  audioFile: File;
}

function* fetchDataSaga(): Generator<any, void, any> {
  try {
    const response = yield call(axios.get, 'http://localhost:5555/api/music/allwithstat');
    yield put(fetchDataSuccess(response.data.data));
  } catch (error) {
    yield put(fetchDataFailure(error));
  }
}

function* createMusicSaga(action: PayloadAction<{ musicData: MusicFormData; userId: string }>): Generator<any, void, any> {
  try {
    const { musicData, userId } = action.payload;
    const response = yield call(axios.post, `http://localhost:5555/api/music/${userId}`, musicData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log("createMusicSaga: ", response.data);
    
    yield put(createMusicSuccess(response.data));
  } catch (error) {
    yield put(createMusicFailure(error));
  }
}

function* updateMusicSaga(action: PayloadAction<{ id: string; musicId: string; formData: MusicFormData }>): Generator<any, void, any> {
  try {
    const { id, musicId, formData } = action.payload;
    const response = yield call(axios.put, `http://localhost:5555/api/music/${id}/${musicId}`, formData,{ withCredentials: true });
    console.log("updateMusicSaga: ", response.data);
    
    yield put(updateMusicSuccess(response.data.data));
  } catch (error) {
    yield put(updateMusicFailure(error));
  }
}

function* deleteMusicSaga(action: PayloadAction<{ id: string; musicId: string }>): Generator<any, void, any> {
  try {
    const { id, musicId } = action.payload;

    // Make the API call to delete the music
    yield call(axios.delete, `http://localhost:5555/api/music/${id}/${musicId}`, { withCredentials: true });

    // Dispatch the deleteMusicSuccess action with the music ID that was deleted
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

