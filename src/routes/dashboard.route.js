import { Router } from "express";
import { getChannelstats, getchannelBlogs } from "../controllers/dashboard.controller.js"
import { verifyjwt } from "../middlewares/auth.js";

const router = Router();
router.use(verifyjwt);

router.route("/c/:channelId").get(getchannelBlogs)

router.route("/c/:channelId/stats").get(getChannelstats);

export default router