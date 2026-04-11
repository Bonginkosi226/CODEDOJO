import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const arcadeChat = async (language, question, history = []) => {
  try {
    const response = await axiosInstance.post(
      API_PATHS.ARCADE.CHAT,
      { language, question, history }
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

const arcadeService = {
  arcadeChat,
  getProgress,
  updateProgress,
};

export default arcadeService;
