import { TRACKS } from '../data/arcadeLessons.js';

// A lesson is "fully complete" only when its mission AND all of its required
// practice problems are passed. Missions completed before required practice
// existed (practiceRequired is not true) count as fully complete, so students
// who were ahead when this shipped are never locked out.

export const getMissionEntry = (user, lesson) =>
  user.completedLessons.find((c) => c.lessonId === lesson.id) || null;

export const isMissionComplete = (user, lesson) => !!getMissionEntry(user, lesson);

export const getPracticeEntry = (user, practiceId) =>
  user.completedPractice.find((p) => p.practiceId === practiceId) || null;

export const countPracticeDone = (user, lesson) =>
  (lesson.practice || []).filter((p) => {
    const entry = getPracticeEntry(user, p.id);
    return entry && entry.completedAt;
  }).length;

export const isFullyComplete = (user, lesson) => {
  const mission = getMissionEntry(user, lesson);
  if (!mission) return false;
  if (mission.practiceRequired !== true) return true;
  return countPracticeDone(user, lesson) >= (lesson.practice || []).length;
};

export const buildLessonStatus = (user) => {
  const status = {};
  for (const lessons of Object.values(TRACKS)) {
    for (const lesson of lessons) {
      status[lesson.id] = {
        missionComplete: isMissionComplete(user, lesson),
        practiceDone: countPracticeDone(user, lesson),
        practiceTotal: (lesson.practice || []).length,
        fullyComplete: isFullyComplete(user, lesson),
      };
    }
  }
  return status;
};
