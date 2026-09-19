import Notification from '../models/Notification.js';

// @desc    Get the current user's notifications (newest first)
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .select('title message category readAt createdAt');

    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    next(error);
  }
};

// @route   PATCH /api/notifications/read-all
export const markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ userId: req.user._id, readAt: null }, { $set: { readAt: new Date() } });
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

// @route   PATCH /api/notifications/:id/read
export const markRead = async (req, res, next) => {
  try {
    await Notification.updateOne({ _id: req.params.id, userId: req.user._id }, { $set: { readAt: new Date() } });
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/notifications/:id
export const deleteNotification = async (req, res, next) => {
  try {
    await Notification.deleteOne({ _id: req.params.id, userId: req.user._id });
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/notifications
export const clearNotifications = async (req, res, next) => {
  try {
    await Notification.deleteMany({ userId: req.user._id });
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
