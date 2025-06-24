import { Like } from "../models/like.model.js"
import { Blog } from "../models/blog.model.js"
import { Comment } from "../models/comment.model.js"
import { asynchandler } from "../utils/asynchandler.js"
import { ApiError } from "../utils/apierror.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const toggleBlogLike = asynchandler(async(req,res)=>{
    const {blogId} = req.params;
    const userId = req.user._id;

    const blog = await Blog.findById(blogId);
    if(!blog) throw new ApiError(404,"Blog not found!");

    const existingLike = await Like.findOne({blog : blogId, likedBy : userId})
    if (existingLike) {
        await existingLike.deleteOne();
        return res
          .status(200)
          .json(new ApiResponse(200, null, "Blog unliked"));
    } else {
        const like = await Like.create({ blog: blogId, likedBy: userId });
        return res
          .status(200)
          .json(new ApiResponse(200, like , "Blog liked"));
    }
})

const toggleCommentLike = asynchandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;
  
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new ApiError(404, "Comment not found!");
    }

    const existingLike = await Like.findOne({
      comment: commentId,
      likedBy: userId,
    });
  
    if (existingLike) {
      await existingLike.deleteOne();
      return res
        .status(200)
        .json(new ApiResponse(200, null, "Comment unliked"));
    } else {
      const newLike = await Like.create({
        comment: commentId,
        likedBy: userId,
      });
      return res
        .status(200)
        .json(new ApiResponse(200, newLike, "Comment liked"));
    }
  });

  const getalllikedblogs = asynchandler(async(req,res)=>{
        const userId = req.user._id;

        const likedBlogs = await Like.find({likedBy: userId, blog: { $ne: null }}).select("blog");

        const blogIds = likedBlogs.map(like => like.blog);

        const blogs = await Blog.find({_id : {$in : blogIds}}).populate("owner","username email");

        return res.status(200).json(
            new ApiResponse(200,blogs,"Liked Blogs fetched successfully!")
        )
                
  })

export {toggleBlogLike, toggleCommentLike, getalllikedblogs}