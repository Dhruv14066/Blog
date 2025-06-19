import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apierror.js";
import { User } from "../models/user.model.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessToken = async (userId) => {
    const user = await User.findById(userId);
    return user.generateAccessToken();
};

const generateRefreshToken = async (userId) => {
    const user = await User.findById(userId);
    return user.generateRefreshToken();
};

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
    const avatar = await uploadOnCloudinary(avatarLocalPath);

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

const loginUser = asynchandler(async(req,res,next) => {
    const { email, password } = req.body;
    if(!email || !password) throw new ApiError(400, "Email and password are required");

    const user = await User.findOne({email});
    if(!user) throw new ApiError(404, "User not found");

    const isPasswordCorrect = await user.ispasscorrect(password);
    if(!isPasswordCorrect) throw new ApiError(401, "Invalid password");

    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    const loggedinUser = await User.findById(user._id).select(
        "-password -refreshToken"
      );

    const option = {
        httpOnly: true,
        secure: true,
    };

    return res
    .status(200)
    .cookie("refreshToken", refreshToken, option)
    .cookie("accessToken", accessToken, option)
    .json(new ApiResponse(
        200, 
        {user: loggedinUser, accessToken, refreshToken}, 
        "User logged in successfully"
    ));
})

const logoutUser = asynchandler(async (req, res) => {
    await User.findByIdAndUpdate(
      req.user._id,
      { $unset: { refreshToken: "" } },
      { new: true }
    );
    const option = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .clearCookie("accessToken", option)
      .clearCookie("refreshToken", option)
      .json(new ApiResponse(200, {}, "User logged out successfully"));
  });

export {registerUser, loginUser, logoutUser}