import mongoose from "mongoose";


const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 200
    },
    isDeleted:{
        type:Boolean,
        default:false
    }

})

export const Category = mongoose.model('categories', CategorySchema);