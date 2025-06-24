import { Comment } from "../models/comment.model.js";
import { Blog } from "../models/blog.model.js";
import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apierror.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addcomment = asynchandler(async (req, res) => {
  const { blogId } = req.params;
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "Content is required!");
  }

  const blog = await Blog.findById(blogId);
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  const createdcomment = await Comment.create({
    content,
    blog: blogId,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, createdcomment, "Comment added successfully!"));
});

const updatecomment = asynchandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!content) throw new ApiError(400, "Updated content is required");

  const comment = await Comment.findById(commentId);
  if (!comment) throw new ApiError(404, "Comment not found!");

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this comment");
  }

  comment.content = content;
  await comment.save();

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"));
});

const deletecomment = asynchandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId); 
  if (!comment) throw new ApiError(404, "Comment not found!");

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this comment");
  }

  await comment.deleteOne(); 
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Comment deleted successfully!"));
});

const getallcomments = asynchandler(async (req, res) => {
  const { blogId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!blogId) {
    throw new ApiError(400, "Blog ID is required");
  }

  const skip = (page - 1) * limit;

  const total = await Comment.countDocuments({ blog: blogId });

  const comments = await Comment.find({ blog: blogId })
    .populate("owner", "username email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        total,
        page: Number(page),
        limit: Number(limit),
        comments,
      },
      "Comments fetched successfully"
    )
  );
});

export { addcomment, updatecomment, deletecomment, getallcomments };
