import { Schema, model } from "mongoose";

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
    owner :{
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    }  
}, { timestamps: true });

blogSchema.plugin(mongoosePaginate);
export default model("Blog", blogSchema);