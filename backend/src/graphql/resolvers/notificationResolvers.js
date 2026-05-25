const Notification = require("../../models/Notification");

const notificationResolvers = {
  Query: {
    notifications: async (_, args, context) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      // clients only see their notifications
      if (context.user.role === "CLIENT") {
        return await Notification.find({
          client: context.user._id,
        })
          .sort({ createdAt: -1 })
          .populate("job")
          .populate("client");
      }

      // admin can see all notifications
      if (context.user.role === "ADMIN") {
        return await Notification.find()
          .sort({ createdAt: -1 })
          .populate("job")
          .populate("client");
      }

      throw new Error("Not authorized");
    },
  },
};

module.exports = notificationResolvers;
