import { Router } from "express";
import { upload } from "../middlewares/multer.js";
import { registerUser,
  loginUser,
  logoutUser,
  changeAccountPassword,
  getCurrentUser,
  updateUserDetails,
  updateUserAvatar,
  refreshAccessToken
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
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyjwt,changeAccountPassword)
router.route("/current-user").get(verifyjwt,getCurrentUser)
router.route("/update-account").patch(verifyjwt,updateUserDetails)
router.route("/update-avatar").patch(verifyjwt, upload.single("avatar"),updateUserAvatar)

export default router