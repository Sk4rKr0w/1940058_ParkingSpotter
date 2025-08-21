const { User } = require('../models/index');

async function sendNotification(userId, message) {
  const user = await User.findByPk(userId);
  if (!user) return;

  console.log(`Notification to ${user.email}: ${message}`);
}

module.exports = { sendNotification };