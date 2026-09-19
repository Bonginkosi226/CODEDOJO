import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

// `practice` is optional: { lessonId, practiceId, walkthrough } — the server looks
// up the practice prompt itself and enforces the failed-attempts gate.
const arcadeChat = async (language, question, history = [], practice = undefined) => {
  try {
    const response = await axiosInstance.post(
      API_PATHS.ARCADE.CHAT,
      { language, question, history, practice }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Arcade chat request failed',
    };
  }
};

const getProgress = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.ARCADE.GET_PROGRESS);
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Failed to fetch arcade progress',
    };
  }
};

const updateProgress = async (progress) => {
  try {
    const response = await axiosInstance.post(API_PATHS.ARCADE.UPDATE_PROGRESS, { progress });
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Failed to update arcade progress',
    };
  }
};

const submitLesson = async (lessonId, code) => {
  try {
    const response = await axiosInstance.post(API_PATHS.ARCADE.SUBMIT_LESSON(lessonId), { code });
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Failed to submit mission',
    };
  }
};

const getPractice = async (lessonId) => {
  try {
    const response = await axiosInstance.get(API_PATHS.ARCADE.GET_PRACTICE(lessonId));
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Failed to load practice problems',
    };
  }
};

const submitPractice = async (lessonId, practiceId, code) => {
  try {
    const response = await axiosInstance.post(API_PATHS.ARCADE.SUBMIT_PRACTICE(lessonId, practiceId), { code });
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Failed to submit practice problem',
    };
  }
};

const arcadeService = {
  arcadeChat,
  getProgress,
  updateProgress,
  submitLesson,
  getPractice,
  submitPractice,
};

export default arcadeService;
