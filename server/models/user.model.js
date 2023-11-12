import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["Client", "Admin"],
        required: true,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    img: {
        type: String,
    },
    address: {
        type: String,
    },
    phone: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    music: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Music',
      }],
}, {
    timestamps: true,
})

export default mongoose.model('User', UserSchema)