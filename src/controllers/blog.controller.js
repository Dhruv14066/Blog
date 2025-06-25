import { Blog } from "../models/blog.model.js";
import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apierror.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createblog = asynchandler(async (req, res) => {
  const { title, content, visibility = "public" } = req.body;

  if (!title || !content) {
    throw new ApiError(400, "Both Title and Content are required!");
  }

  const createdblog = await Blog.create({
    title,
    content,
    visibility,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, createdblog, "New Blog is created"));
});

const getAllBlogs = asynchandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "createdAt",
    sortType = "desc",
    userId,
  } = req.query;

  const filter = { visibility: "public" };

  if (query) {
    filter.$or = [
      { title: { $regex: query, $options: "i" } },
      { content: { $regex: query, $options: "i" } },
    ];
  }

  if (userId) {
    if (req.user && req.user._id.toString() === userId.toString()) {
      delete filter.visibility;
      filter.owner = userId;
    } else {
      filter.owner = userId;
    }
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
    }, "Blogs Fetched Successfully")
  );
});

const getblogbyid = asynchandler(async (req, res) => {
  const { blogId } = req.params;
  const blog = await Blog.findById(blogId).populate("owner", "username email");

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  const isOwner = req.user && blog.owner.toString() === req.user._id.toString();

  if (blog.visibility === "private" && !isOwner) {
    throw new ApiError(403, "This blog is private");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, blog, "Blog fetched successfully"));
});

const updateBlog = asynchandler(async (req, res) => {
  const { blogId } = req.params;
  const { title, content, visibility } = req.body;

  const blog = await Blog.findById(blogId);
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  if (blog.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this blog");
  }

  if (title) blog.title = title;
  if (content) blog.content = content;
  if (visibility) blog.visibility = visibility;

  await blog.save();

  return res
    .status(200)
    .json(new ApiResponse(200, blog, "Blog has been updated"));
});

const deleteBlog = asynchandler(async (req, res) => {
  const { blogId } = req.params;
  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  if (blog.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this blog");
  }

  await blog.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Blog deleted successfully!"));
});

export { createblog, getAllBlogs, getblogbyid, updateBlog, deleteBlog };
