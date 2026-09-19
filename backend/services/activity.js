const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const startOfDay = (d) => {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

/**
 * Record that the student did a graded Arcade submission today: updates
 * lastActivityDate and the consecutive-day streak. Does not save the user.
 */
export const touchActivity = (user) => {
  const now = new Date();

  if (!user.lastActivityDate) {
    user.currentStreak = 1;
  } else if (!sameDay(new Date(user.lastActivityDate), now)) {
    const gapDays = Math.round((startOfDay(now) - startOfDay(new Date(user.lastActivityDate))) / 86400000);
    user.currentStreak = gapDays === 1 ? (user.currentStreak || 0) + 1 : 1;
  }

  user.lastActivityDate = now;
};
