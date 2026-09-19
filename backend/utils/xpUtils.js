// Level = Floor(sqrt(XP / 100)) + 1
export const calculateLevel = (xp) => {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

// Small, tiered XP for required practice problems. The lesson mission still
// awards its own (larger) XP immediately on first pass.
export const PRACTICE_XP = {
  easy: 10,
  medium: 15,
  hard: 20,
};
