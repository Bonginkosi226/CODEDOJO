import User from '../models/User.js';

// @desc    Get global leaderboard (top 50)
// @route   GET /api/leaderboard
// @access  Private
export const getLeaderboard = async (req, res, next) => {
  try {
    // Admins (teachers) never appear on the student leaderboard.
    const topUsers = await User.find({ role: { $ne: 'admin' } })
      .sort({ xp: -1 })
      .limit(50)
      .select('username xp level profileImage badges');

    res.status(200).json({
      success: true,
      data: topUsers,
    });
  } catch (error) {
    next(error);
  }
};
