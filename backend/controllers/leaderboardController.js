import User from '../models/User.js';

// Calculate level based on XP
// Level = Floor(sqrt(XP / 100)) + 1
const calculateLevel = (xp) => {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

// @desc    Get global leaderboard (top 50)
// @route   GET /api/leaderboard
// @access  Private
export const getLeaderboard = async (req, res, next) => {
  try {
    const topUsers = await User.find({})
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

// @desc    Award XP to the current user
// @route   POST /api/leaderboard/xp
// @access  Private
export const awardXP = async (req, res, next) => {
  try {
    const { amount, reason } = req.body;
    const userId = req.user._id;

    if (!amount || typeof amount !== 'number') {
      return res.status(400).json({ success: false, error: 'Valid XP amount is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const previousLevel = user.level;
    user.xp += amount;
    const newLevel = calculateLevel(user.xp);
    user.level = newLevel;

    // Optional: could add logic to award specific logic-based badges here
    
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        xpAdded: amount,
        newTotalXp: user.xp,
        leveledUp: newLevel > previousLevel,
        newLevel: user.level,
        message: newLevel > previousLevel ? `Leveled up to ${newLevel}!` : `Gained ${amount} XP for ${reason || 'activity'}`,
      },
    });
  } catch (error) {
    next(error);
  }
};
