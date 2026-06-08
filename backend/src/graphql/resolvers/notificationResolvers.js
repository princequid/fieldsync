const Notification = require("../../models/Notification");

const formatDate = require("../../utils/formatDate");

const notificationResolvers = {
  Notification: {
    createdAt: (notification) => formatDate(notification.createdAt),
    updatedAt: (notification) => formatDate(notification.updatedAt),
  },

  Query: {
    notifications: async (_, args, context) => {
      if (!context.user) throw new Error("Not authenticated");

      if (context.user.role === "CLIENT") {
        return await Notification.find({ client: context.user._id })
          .sort({ createdAt: -1 })
          .populate("job")
          .populate("client");
      }

      if (context.user.role === "ADMIN") {
        return await Notification.find()
          .sort({ createdAt: -1 })
          .populate("job")
          .populate("client");
      }

      throw new Error("Not authorized");
    },
  },

  Mutation: {
    markNotificationRead: async (_, { notificationId }, context) => {
      if (!context.user) throw new Error("Not authenticated");

      const notif = await Notification.findById(notificationId);
      if (!notif) throw new Error("Notification not found");

      notif.isRead = true;
      await notif.save();
      return await Notification.findById(notif._id).populate("job").populate("client");
    },

    markAllNotificationsRead: async (_, args, context) => {
      if (!context.user) throw new Error("Not authenticated");

      const filter = context.user.role === "CLIENT"
        ? { client: context.user._id, isRead: false }
        : { isRead: false };

      await Notification.updateMany(filter, { isRead: true });
      return true;
    },
  },
};

module.exports = notificationResolvers;
