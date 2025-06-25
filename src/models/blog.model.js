import mongoose, { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    views : {
        type : Number, 
        default : 0
    },
    isPublished : {
        type : Boolean,
        default : true
    },
    visibility: {
        type: String,
        enum: ["public", "private"],
        default: "public"
    },
    owner :{
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    } 
}, { timestamps: true });

blogSchema.plugin(mongoosePaginate);
export const Blog =  mongoose.model("Blog", blogSchema);