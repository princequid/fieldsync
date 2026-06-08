const Notification = require("../models/Notification");

const createNotification = async ({
  client,
  job,
  message
}) => {

  return await Notification.create({
    client,
    job,
    message
  });
};

module.exports = {
  createNotification
};