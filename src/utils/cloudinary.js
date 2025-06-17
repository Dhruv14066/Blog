import {v2 as cloudinary} from "cloudinary";
import { response } from "express";
import fs from "fs"
import { ApiError } from "./apierror";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
})

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        const resp = await cloudinary.uploader.upload(localFilePath,{resource_type : "auto"})
        fs.unlinkSync(localFilePath)
        return resp
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null
    }
}

const deleteOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null
        const resp = await cloudinary.uploader.destroy(localFilePath);
        if(resp.result != "ok") throw new ApiError(500,"Failed to delete image from Cloudinary");
        else return resp;
    } catch (error) {
        throw new ApiError("Error while deleting old files from cloudinary");
    }
}

export {uploadOnCloudinary, deleteOnCloudinary}