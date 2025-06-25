import { Router } from "express";
import { toggleSubscription, userSubscribedChannel, subscriberCount } from "../controllers/subscription.controller.js";
import { verifyjwt } from "../middlewares/auth.js";

const router = Router();
router.use(verifyjwt)

router
    .route("/c/:channelId")
    .post(toggleSubscription)
    .get(subscriberCount)

router.route("/u/:subscriberId").get(userSubscribedChannel)

export default router