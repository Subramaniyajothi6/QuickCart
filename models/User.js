import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    imageUrl: {
        type: String,
       required: true 
    },
    cartItem : {
        type: Object,
        default: {}
    },
    // password: {
    //     type: String,
    //     required: true
    // },
    // role: {
    //     type: String,
    //     required: true
    // },
    // token: {
    //     type: String,
    //     required: true
    // },
    // createdAt: {
    //     type: Date,
    //     default: Date.now
    // }
},{minimize: false})

const User = mongoose.models.user || mongoose.model('User', userSchema)
export default User