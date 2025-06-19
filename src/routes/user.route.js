import { Router } from "express";
import { upload } from "../middlewares/multer.js";
import { registerUser,
        loginUser,
        logoutUser
 } from "../controllers/user.controller.js";
 import { verifyjwt } from "../middlewares/auth.js";

const router = Router()
router.route("/register").post(
    upload.fields([
        {
            name : "avatar",
            maxCount : 1
        }
    ]),registerUser
)

router.route("/login").post(loginUser)
router.route("/logout").post(verifyjwt, logoutUser)

export default router