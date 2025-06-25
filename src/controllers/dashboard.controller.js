import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apierror.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Blog } from "../models/blog.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";

const getchannelBlogs = asynchandler(async(req,res)=>{
     const { channelId } = req.params;
    const { page = 1, limit = 10, sortBy = "createdAt", sortType = "desc" } = req.query;

    if (!channelId) throw new ApiError(400, "Channel ID is required");

    const isOwner = req.user && req.user._id.toString() === channelId.toString();

    const filter = {
        owner: channelId,
    };

    if (!isOwner) {
        filter.visibility = "public"; 
    }

    const sortOptions = {
        [sortBy]: sortType === "asc" ? 1 : -1,
    };

    const total = await Blog.countDocuments(filter);
    const blogs = await Blog.find(filter)
    .populate("owner", "username email")
    .sort(sortOptions)
    .skip((page - 1) * limit)
    .limit(Number(limit));

    return res.status(200).json(
        new ApiResponse(200, {
        total,
        page: Number(page),
        limit: Number(limit),
        blogs,
     }, "Channel blogs fetched successfully")
    );
})

const getChannelstats = asynchandler(async(req,res)=>{
    const { channelId } = req.params;

    if (!channelId) {
        throw new ApiError(400, "Channel ID is required");
    }

    const user = await User.findById(channelId).select("username email fullname avatar");
    if (!user) {
        throw new ApiError(404, "Channel (User) not found");
    }
    const totalBlogs = await Blog.countDocuments({ owner: channelId });

    const subscriberCount = await Subscription.countDocuments({ channel: channelId });

    const blogs = await Blog.find({ owner: channelId }).select("_id");
    const blogIds = blogs.map((b) => b._id);

    const totalLikes = await Like.countDocuments({
        blog: { $in: blogIds },
    });

    return res.status(200).json(
        new ApiResponse(
        200,
        {
            user,
            totalBlogs,
            subscriberCount,
            totalLikes,
        },
        "Channel statistics fetched successfully"
        )
    );
})

export {getChannelstats, getchannelBlogs}