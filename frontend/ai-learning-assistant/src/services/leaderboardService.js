import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const getLeaderboard = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.LEADERBOARD.GET);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch leaderboard' };
  }
};

const leaderboardService = {
  getLeaderboard,
};

export default leaderboardService;
