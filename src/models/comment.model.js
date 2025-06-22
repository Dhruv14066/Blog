import { Schema, model } from "mongoose";

const commentSchema = new Schema({
    content : {
        type : String,
        required : true
    },
    blog : {
        type : Schema.Types.ObjectId,
        ref : "Blog",
    },
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    }
})
export const Comment = mongoose.model("Comment", commentSchema)