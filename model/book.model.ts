import mongoose, { Types } from "mongoose";

const BookSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        minLength: 3

    },
    author:{
        type:String,
        required:true,
        minLength: 2
    },
    description:{
        type:String,
        minLength: 10,
        maxLength: 600
    },
    pageCount:{
        type:Number,
        required:true,
    },
    publishedAt:{
        type:String,
    },
    categoryId:{
        type: Types.ObjectId,
        ref: "categories"
    },
    isDeleted:{
        type: Boolean,
        default: false
    }
})

export const Book = mongoose.model('books',BookSchema);