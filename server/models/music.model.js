// music.model.js

import mongoose from 'mongoose';

const MusicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  album: {
    type: String,
  },
  genre: {
    type: String,
  },
  coverImg: {
    public_id: {
        type: String,
    },
    url: {
        type: String,
    }
  },
  audio: {
    public_id: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    }
  },
  rating: {
    type: Number,
    default: 0,
  },
  ratingCount: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
    timestamps: true,
});

const Music = mongoose.model('Music', MusicSchema);

export default Music;
