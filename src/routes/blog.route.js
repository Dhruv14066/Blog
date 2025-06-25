import { Router } from "express";
import { createblog, getAllBlogs, getblogbyid, updateBlog, deleteBlog } from "../controllers/blog.controller.js"
import { verifyjwt } from "../middlewares/auth.js";

const router = Router();
router.use(verifyjwt)

router
    .route("/")
    .get(getAllBlogs)
    .post(createblog)

router
    .route("/:blogId")
    .get(getblogbyid)
    .delete(deleteBlog)
    .patch(updateBlog)

export default router