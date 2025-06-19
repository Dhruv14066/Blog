import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apierror.js";
import { asynchandler } from "../utils/asynchandler.js";

const verifyjwt = asynchandler(async(req,res,next)=>{
    try {
        const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
        if(!token) throw new ApiError(401, "Unauthorized");
        const decodedtoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedtoken._id).select("-password -refreshToken");
        if(!user) throw new ApiError(401, "Unauthorized");
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid access token");
    }
})

export {verifyjwt}                                                                                                                                                                                                                                                                                                                                                                                                                      