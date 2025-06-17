import { Router } from "express";
import { upload } from "../middlewares/multer";
import { registerUser } from "../controllers/user.controller";

const router = Router()
router.route("/register").post(
    upload.fields([
        {
            name : "avatar",
            maxCount : 1
        }
    ]),registerUser
)