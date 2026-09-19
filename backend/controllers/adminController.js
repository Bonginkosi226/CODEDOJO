import mongoose from 'mongoose';
import User from '../models/User.js';
import Quiz from '../models/Quiz.js';
import Document from '../models/Document.js';
import Notification from '../models/Notification.js';
import { TRACKS, findLessonById, findPractice } from '../data/arcadeLessons.js';
import { isMissionComplete } from '../services/lessonProgress.js';

const DAY_MS = 24 * 60 * 60 * 1000;

// Admins are teachers, not students: they are excluded from every student
// count, list, ranking and aggregate below. Users with no role are students.
const STUDENT_FILTER = { role: { $ne: 'admin' } };

const arr = (path) => ({ $ifNull: [path, []] });

// Adds `lastActive` = the latest of: lastActivityDate, most recent mission,
// practice or quiz completion. Existing students who haven't acted since
// activity tracking was added still get a sensible value from their history.
const lastActiveStages = [
  {
    $lookup: {
      from: 'quizzes',
      let: { uid: '$_id' },
      pipeline: [
        { $match: { $expr: { $eq: ['$userId', '$$uid'] }, completedAt: { $ne: null } } },
        { $group: { _id: null, last: { $max: '$completedAt' } } },
      ],
      as: 'quizAgg',
    },
  },
  {
    $addFields: {
      lastActive: {
        $max: [
          '$lastActivityDate',
          { $max: '$completedLessons.completedAt' },
          { $max: '$completedPractice.completedAt' },
          { $arrayElemAt: ['$quizAgg.last', 0] },
        ],
      },
    },
  },
];

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// @desc    Headline numbers + most recent activity across all students
// @route   GET /api/admin/overview
// @access  Admin
export const getOverview = async (req, res, next) => {
  try {
    const cutoff = new Date(Date.now() - 7 * DAY_MS);

    const [facets] = await User.aggregate([
      { $match: STUDENT_FILTER },
      ...lastActiveStages,
      { $addFields: { lastSeen: { $ifNull: ['$lastActive', '$createdAt'] } } },
      {
        $facet: {
          totals: [
            {
              $group: {
                _id: null,
                totalStudents: { $sum: 1 },
                activeStudents: { $sum: { $cond: [{ $gte: ['$lastActive', cutoff] }, 1, 0] } },
                inactiveStudents: { $sum: { $cond: [{ $lt: ['$lastSeen', cutoff] }, 1, 0] } },
              },
            },
          ],
          missions: [
            { $unwind: '$completedLessons' },
            { $match: { 'completedLessons.completedAt': { $gte: cutoff } } },
            { $count: 'n' },
          ],
        },
      },
    ]);

    const totals = facets.totals[0] || { totalStudents: 0, activeStudents: 0, inactiveStudents: 0 };

    const [recentMissions, recentPractice, recentQuizzes] = await Promise.all([
      User.aggregate([
        { $match: STUDENT_FILTER },
        { $unwind: '$completedLessons' },
        { $sort: { 'completedLessons.completedAt': -1 } },
        { $limit: 10 },
        {
          $project: {
            _id: 0,
            studentId: '$_id',
            username: 1,
            title: '$completedLessons.title',
            at: '$completedLessons.completedAt',
          },
        },
      ]),
      User.aggregate([
        { $match: STUDENT_FILTER },
        { $unwind: '$completedPractice' },
        { $match: { 'completedPractice.completedAt': { $ne: null } } },
        { $sort: { 'completedPractice.completedAt': -1 } },
        { $limit: 10 },
        {
          $project: {
            _id: 0,
            studentId: '$_id',
            username: 1,
            lessonId: '$completedPractice.lessonId',
            practiceId: '$completedPractice.practiceId',
            at: '$completedPractice.completedAt',
          },
        },
      ]),
      Quiz.aggregate([
        { $match: { completedAt: { $ne: null } } },
        { $sort: { completedAt: -1 } },
        { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'student' } },
        { $unwind: '$student' },
        { $match: { 'student.role': { $ne: 'admin' } } },
        { $limit: 10 },
        {
          $project: {
            _id: 0,
            studentId: '$student._id',
            username: '$student.username',
            title: 1,
            score: 1,
            totalQuestions: 1,
            at: '$completedAt',
          },
        },
      ]),
    ]);

    const recentActivity = [
      ...recentMissions.map((m) => ({
        type: 'mission',
        studentId: m.studentId,
        username: m.username,
        description: `Passed mission: ${m.title}`,
        at: m.at,
      })),
      ...recentPractice.map((p) => {
        const found = findLessonById(p.lessonId);
        const problem = found && findPractice(found.lesson, p.practiceId);
        return {
          type: 'practice',
          studentId: p.studentId,
          username: p.username,
          description: `Finished practice: ${problem ? problem.title : p.practiceId}`,
          at: p.at,
        };
      }),
      ...recentQuizzes.map((q) => ({
        type: 'quiz',
        studentId: q.studentId,
        username: q.username,
        description: `Completed quiz: ${q.title} (${q.score}/${q.totalQuestions})`,
        at: q.at,
      })),
    ]
      .sort((a, b) => new Date(b.at) - new Date(a.at))
      .slice(0, 10);

    res.status(200).json({
      success: true,
      data: {
        totalStudents: totals.totalStudents,
        activeStudents: totals.activeStudents,
        missionsPassedLast7Days: facets.missions[0]?.n || 0,
        inactiveStudents: totals.inactiveStudents,
        recentActivity,
      },
    });
  } catch (error) {
    next(error);
  }
};

const SORT_FIELDS = {
  xp: 'xp',
  level: 'level',
  lessons: 'lessonsTotal',
  lastActive: 'lastActive',
};

// @desc    Paginated, searchable, sortable student list (admins excluded)
// @route   GET /api/admin/students?search=&sort=&order=&page=&limit=
// @access  Admin
export const getStudents = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
    const search = (req.query.search || '').toString().trim();
    const sortField = SORT_FIELDS[req.query.sort] || 'xp';
    const direction = req.query.order === 'asc' ? 1 : -1;

    const match = { ...STUDENT_FILTER };
    if (search) {
      const regex = { $regex: escapeRegex(search), $options: 'i' };
      match.$or = [{ username: regex }, { email: regex }];
    }

    const countLessons = (language) => ({
      $size: {
        $filter: { input: arr('$completedLessons'), as: 'l', cond: { $eq: ['$$l.language', language] } },
      },
    });

    const [result] = await User.aggregate([
      { $match: match },
      ...lastActiveStages,
      {
        $addFields: {
          lessonsJava: countLessons('java'),
          lessonsPython: countLessons('python'),
          lessonsTotal: { $size: arr('$completedLessons') },
          practiceCompleted: {
            $size: {
              $filter: { input: arr('$completedPractice'), as: 'p', cond: { $ne: ['$$p.completedAt', null] } },
            },
          },
        },
      },
      {
        $facet: {
          data: [
            { $sort: { [sortField]: direction, _id: 1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit },
            {
              // Explicit allow-list: never leak the password hash or code.
              $project: {
                _id: 0,
                id: '$_id',
                username: 1,
                email: 1,
                level: { $ifNull: ['$level', 1] },
                xp: { $ifNull: ['$xp', 0] },
                lessons: { java: '$lessonsJava', python: '$lessonsPython', total: '$lessonsTotal' },
                practiceCompleted: 1,
                currentStreak: { $ifNull: ['$currentStreak', 0] },
                lastActive: 1,
              },
            },
          ],
          total: [{ $count: 'n' }],
        },
      },
    ]);

    const total = result.total[0]?.n || 0;

    res.status(200).json({
      success: true,
      data: {
        students: result.data,
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    One student's full picture (titles only for documents, never file contents)
// @route   GET /api/admin/students/:id
// @access  Admin
export const getStudentDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    const user = await User.findOne({ _id: id, ...STUDENT_FILTER }).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    const practiceEntry = (practiceId) => user.completedPractice.find((p) => p.practiceId === practiceId);

    // Progress per track
    const progress = {};
    for (const [language, lessons] of Object.entries(TRACKS)) {
      const allPractice = lessons.flatMap((l) => l.practice || []);
      progress[language] = {
        lessonsTotal: lessons.length,
        lessonsCompleted: lessons.filter((l) => isMissionComplete(user, l)).length,
        practiceTotal: allPractice.length,
        practiceCompleted: allPractice.filter((p) => practiceEntry(p.id)?.completedAt).length,
      };
    }

    // Everything completed, with dates
    const completedMissions = user.completedLessons
      .map((c) => ({
        lessonId: c.lessonId,
        language: c.language,
        title: c.title || findLessonById(c.lessonId)?.lesson.title || c.lessonId,
        completedAt: c.completedAt,
      }))
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

    const completedPractice = user.completedPractice
      .filter((p) => p.completedAt)
      .map((p) => {
        const found = findLessonById(p.lessonId);
        const problem = found && findPractice(found.lesson, p.practiceId);
        return {
          lessonId: p.lessonId,
          practiceId: p.practiceId,
          language: found?.language || null,
          lessonTitle: found?.lesson.title || p.lessonId,
          title: problem ? problem.title : p.practiceId,
          failedAttemptsBeforePass: p.attempts,
          completedAt: p.completedAt,
        };
      })
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

    // Currently failing: attempted, not passed, with their last submitted code
    const stuck = [];
    for (const m of user.missionAttempts) {
      const found = findLessonById(m.lessonId);
      if (!found || m.attempts <= 0 || isMissionComplete(user, found.lesson)) continue;
      stuck.push({
        type: 'mission',
        lessonId: m.lessonId,
        language: found.language,
        lessonTitle: found.lesson.title,
        title: found.lesson.title,
        attempts: m.attempts,
        lastCode: m.code,
        lastAttemptAt: m.lastAttemptAt,
      });
    }
    for (const p of user.completedPractice) {
      if (p.completedAt || p.attempts <= 0) continue;
      const found = findLessonById(p.lessonId);
      const problem = found && findPractice(found.lesson, p.practiceId);
      stuck.push({
        type: 'practice',
        lessonId: p.lessonId,
        practiceId: p.practiceId,
        language: found?.language || null,
        lessonTitle: found?.lesson.title || p.lessonId,
        title: problem ? problem.title : p.practiceId,
        attempts: p.attempts,
        lastCode: p.code,
      });
    }
    stuck.sort((a, b) => b.attempts - a.attempts);

    const [quizzes, documents] = await Promise.all([
      Quiz.find({ userId: user._id })
        .select('title score totalQuestions completedAt createdAt documentId')
        .populate('documentId', 'title')
        .sort({ createdAt: -1 }),
      // Titles only — extractedText, chunks and file paths are never selected.
      Document.find({ userId: user._id }).select('title fileName uploadDate status').sort({ uploadDate: -1 }),
    ]);

    const [activity] = await User.aggregate([
      { $match: { _id: user._id } },
      ...lastActiveStages,
      { $project: { lastActive: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        student: {
          id: user._id,
          username: user.username,
          email: user.email,
          level: user.level,
          xp: user.xp,
          currentStreak: user.currentStreak || 0,
          lastActive: activity?.lastActive || null,
          joinedAt: user.createdAt,
        },
        progress,
        completedMissions,
        completedPractice,
        stuck,
        quizzes: quizzes.map((q) => ({
          id: q._id,
          title: q.title,
          documentTitle: q.documentId?.title || null,
          score: q.score,
          totalQuestions: q.totalQuestions,
          completedAt: q.completedAt,
        })),
        documents: documents.map((d) => ({
          id: d._id,
          title: d.title,
          fileName: d.fileName,
          uploadedAt: d.uploadDate,
          status: d.status,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Missions and practice problems ranked by lowest pass rate, then highest
//          average failed attempts, each with the students currently stuck on it
// @route   GET /api/admin/struggles
// @access  Admin
export const getStruggles = async (req, res, next) => {
  try {
    const [practiceAgg, missionFailAgg, missionDoneAgg] = await Promise.all([
      User.aggregate([
        { $match: STUDENT_FILTER },
        { $unwind: '$completedPractice' },
        {
          $group: {
            _id: '$completedPractice.practiceId',
            lessonId: { $first: '$completedPractice.lessonId' },
            attempted: { $sum: 1 },
            completed: { $sum: { $cond: [{ $ne: ['$completedPractice.completedAt', null] }, 1, 0] } },
            totalFailed: { $sum: '$completedPractice.attempts' },
            entries: {
              $push: {
                studentId: '$_id',
                username: '$username',
                attempts: '$completedPractice.attempts',
                done: { $ne: ['$completedPractice.completedAt', null] },
              },
            },
          },
        },
      ]),
      User.aggregate([
        { $match: STUDENT_FILTER },
        { $unwind: '$missionAttempts' },
        {
          $addFields: {
            done: { $in: ['$missionAttempts.lessonId', arr('$completedLessons.lessonId')] },
          },
        },
        {
          $group: {
            _id: '$missionAttempts.lessonId',
            totalFailed: { $sum: '$missionAttempts.attempts' },
            entries: {
              $push: {
                studentId: '$_id',
                username: '$username',
                attempts: '$missionAttempts.attempts',
                done: '$done',
              },
            },
          },
        },
      ]),
      User.aggregate([
        { $match: STUDENT_FILTER },
        { $unwind: '$completedLessons' },
        { $group: { _id: '$completedLessons.lessonId', completed: { $sum: 1 } } },
      ]),
    ]);

    const stuckOf = (entries) =>
      entries
        .filter((e) => !e.done && e.attempts > 0)
        .sort((a, b) => b.attempts - a.attempts)
        .map((e) => ({ id: e.studentId, username: e.username, attempts: e.attempts }));

    const items = [];

    // Missions: attempted = students who passed + students still failing.
    const missionFail = new Map(missionFailAgg.map((m) => [m._id, m]));
    const missionDone = new Map(missionDoneAgg.map((m) => [m._id, m.completed]));
    for (const lessons of Object.values(TRACKS)) {
      for (const lesson of lessons) {
        const completed = missionDone.get(lesson.id) || 0;
        const fail = missionFail.get(lesson.id);
        const stuckStudents = fail ? stuckOf(fail.entries) : [];
        const attempted = completed + stuckStudents.length;
        if (attempted === 0) continue;
        const found = findLessonById(lesson.id);
        items.push({
          type: 'mission',
          id: lesson.id,
          title: lesson.title,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          language: found.language,
          attempted,
          completed,
          passRate: completed / attempted,
          avgFailedAttempts: (fail ? fail.totalFailed : 0) / attempted,
          stuckStudents,
        });
      }
    }

    // Practice: attempted = students who have submitted at least once.
    for (const p of practiceAgg) {
      const found = findLessonById(p.lessonId);
      const problem = found && findPractice(found.lesson, p._id);
      items.push({
        type: 'practice',
        id: p._id,
        title: problem ? problem.title : p._id,
        lessonId: p.lessonId,
        lessonTitle: found?.lesson.title || p.lessonId,
        language: found?.language || null,
        attempted: p.attempted,
        completed: p.completed,
        passRate: p.completed / p.attempted,
        avgFailedAttempts: p.totalFailed / p.attempted,
        stuckStudents: stuckOf(p.entries),
      });
    }

    items.sort(
      (a, b) =>
        a.passRate - b.passRate ||
        b.avgFailedAttempts - a.avgFailedAttempts ||
        b.attempted - a.attempted
    );

    res.status(200).json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

// @desc    Send an announcement (a Notification) to every student
// @route   POST /api/admin/announcements
// @access  Admin
export const createAnnouncement = async (req, res, next) => {
  try {
    const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
    const message = typeof req.body.message === 'string' ? req.body.message.trim() : '';

    if (!title || !message) {
      return res.status(400).json({ success: false, error: 'Please provide a title and a message' });
    }
    if (title.length > 120) {
      return res.status(400).json({ success: false, error: 'Title must be 120 characters or fewer' });
    }
    if (message.length > 2000) {
      return res.status(400).json({ success: false, error: 'Message must be 2000 characters or fewer' });
    }

    const students = await User.find(STUDENT_FILTER).select('_id');

    const docs = students.map((s) => ({
      userId: s._id,
      title,
      message,
      category: 'system',
      createdBy: req.user._id,
    }));

    for (let i = 0; i < docs.length; i += 1000) {
      await Notification.insertMany(docs.slice(i, i + 1000));
    }

    res.status(201).json({
      success: true,
      data: { recipients: docs.length },
      message: `Announcement sent to ${docs.length} student${docs.length === 1 ? '' : 's'}`,
    });
  } catch (error) {
    next(error);
  }
};
