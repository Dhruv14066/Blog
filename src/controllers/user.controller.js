import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/APIerrors.js";
import { User } from "../models/user.model.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asynchandler(async (req,res,next) => {
    const { username, email, fullname, password } = req.body;

    if( [fullname, email, username, password].some((field) => field?.trim() === ""))
        throw new ApiError(400,"All fields are required");
    const existedUser  = await User.findOne({
        $or : [{username},{email}]
    });
    if(existedUser) throw new ApiError(409,"User already exist!")

    const avatarLocalPath = req.files?.avatar[0]?.path;

    
    if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
    }
    const avatar = await uploadOnCloudinary(avatarlocalpath);

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        email,
        username: username.toLowerCase(),
        password,
    });
    
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken" 
    );
    if(!createdUser) throw new ApiError(500, "Something Went Wrong while registering the user ");
    return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
})

export {registerUser}