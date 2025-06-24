import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/apierror.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";

const toggleSubscription = asynchandler(async (req, res) => {
  const subscriberId = req.user._id;
  const { channelId } = req.params;

  if (subscriberId.toString() === channelId)
    throw new ApiError(400, "You cannot subscribe to yourself!");

  const existingSubscription = await Subscription.findOne({
    subscriber: subscriberId,
    channel: channelId,
  });

  if (existingSubscription) {
    await existingSubscription.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Unsubscribed successfully!"));
  } else {
    const subscribe = await Subscription.create({
      subscriber: subscriberId,
      channel: channelId,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, subscribe, "Subscribed successfully!"));
  }
});

const userSubscribedChannel = asynchandler(async (req, res) => {
  const userId = req.user._id;

  const subscribedTo = await Subscription.find({ subscriber: userId }).populate(
    "channel",
    "username email fullname avatar"
  );

  const channels = subscribedTo.map((sub) => sub.channel);

  return res
    .status(200)
    .json(new ApiResponse(200, channels, "Subscribed channels fetched successfully!"));
});

const subscriberCount = asynchandler(async (req, res) => {
  const { channelId } = req.params;
  if (!channelId) throw new ApiError(400, "Channel ID is required");

  const count = await Subscription.countDocuments({ channel: channelId });

  return res
    .status(200)
    .json(new ApiResponse(200, { subscriberCount: count }, "Subscriber count fetched!"));
});

export { toggleSubscription, userSubscribedChannel, subscriberCount };
