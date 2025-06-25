import { Router, Router } from "express";
import {toggleBlogLike, toggleCommentLike, getalllikedblogs} from "../controllers/like.controller.js"
import { verifyjwt } from "../middlewares/auth.js";

const router = Router();

router.use(verifyjwt)

router.route("/toggle/b/:blogId").post(toggleBlogLike)
router.route("/toggle/c/:commentId").post(toggleCommentLike)
router.route("/blogs").get(getalllikedblogs)

export default router