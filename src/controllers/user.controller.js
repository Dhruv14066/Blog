import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apierror.js";
import { User } from "../models/user.model.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import fs from "fs/promises"; // for deleting local files

const generateAccessToken = async (userId) => {
  const user = await User.findById(userId);
  return user.generateAccessToken();
};

const generateRefreshToken = async (userId) => {
  const user = await User.findById(userId);
  return user.generateRefreshToken();
};

const refreshAccessToken = asynchandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken} = await generateAccessToken(user._id)
        const {newRefreshToken} = await generateRefreshToken(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})
const registerUser = asynchandler(async (req, res) => {
  const { username, email, fullname, password } = req.body;

  if ([fullname, email, username, password].some((field) => !field?.trim()))
    throw new ApiError(400, "All fields are required");

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) throw new ApiError(409, "User already exists!");

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  if (!avatarLocalPath) throw new ApiError(400, "Avatar file is required");

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    email,
    username: username.toLowerCase(),
    password,
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");
  if (!createdUser) throw new ApiError(500, "Something went wrong");

  await fs.unlink(avatarLocalPath).catch(() => {}); // cleanup

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asynchandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, "Email and password are required");

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  const isPasswordCorrect = await user.ispasscorrect(password);
  if (!isPasswordCorrect) throw new ApiError(401, "Invalid password");

  const accessToken = await generateAccessToken(user._id);
  const refreshToken = await generateRefreshToken(user._id);

  const loggedinUser = await User.findById(user._id).select("-password -refreshToken");

  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, option)
    .cookie("accessToken", accessToken, option)
    .json(new ApiResponse(200, { user: loggedinUser, accessToken, refreshToken }, "User logged in successfully"));
});

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

const changeAccountPassword = asynchandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  const isPassValid = await user.ispasscorrect(oldPassword);
  if (!isPassValid) throw new ApiError(400, "Invalid old password");

  user.password = newPassword;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asynchandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const updateUserDetails = asynchandler(async (req, res) => {
  const { fullname, email } = req.body;
  if (!fullname || !email) throw new ApiError(400, "All fields are required!");

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { fullname, email } },
    { new: true }
  ).select("-password");

  return res.status(200).json(new ApiResponse(200, user, "User updated successfully!"));
});

const updateUserAvatar = asynchandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) throw new ApiError(400, "Avatar file is missing");

  const user = await User.findById(req.user._id);
  if (!user) {
    await fs.unlink(avatarLocalPath).catch(() => {});
    throw new ApiError(404, "User not found");
  }

  // optional: delete old avatar
  if (user.avatar) {
    try {
      const publicId = user.avatar
        .split("/")
        .slice(-2)
        .join("/")
        .replace(/\.[a-z]+$/i, "");
      await deleteOnCloudinary(publicId);
    } catch (err) {
      console.warn("Failed to delete old avatar:", err.message);
    }
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar?.url) {
    await fs.unlink(avatarLocalPath).catch(() => {});
    throw new ApiError(400, "Error while uploading avatar");
  }

  user.avatar = avatar.url;
  await user.save();
  await fs.unlink(avatarLocalPath).catch(() => {});

  return res
    .status(200)
    .json(new ApiResponse(200, user.toObject(), "Avatar image updated successfully"));
});

export {
  generateAccessToken,
  generateRefreshToken,
  registerUser,
  loginUser,
  logoutUser,
  changeAccountPassword,
  getCurrentUser,
  updateUserDetails,
  updateUserAvatar,
  refreshAccessToken
};
