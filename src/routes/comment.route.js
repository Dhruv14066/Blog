import { Router } from "express";
import { addcomment, updatecomment, deletecomment, getallcomments } from "../controllers/comment.controller.js"
import { verifyjwt } from "../middlewares/auth.js";

const router = Router();

router.use(verifyjwt)

router.route("/:blogId").get(getallcomments)
                         .post(addcomment)
                         
router
  .route("/comment/:commentId")
  .patch(updatecomment) 
  .delete(deletecomment)

export default router