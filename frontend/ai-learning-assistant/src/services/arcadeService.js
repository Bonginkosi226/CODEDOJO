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

const arcadeService = {
  arcadeChat,
};

export default arcadeService;
