// Level = Floor(sqrt(XP / 100)) + 1
export const calculateLevel = (xp) => {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};
