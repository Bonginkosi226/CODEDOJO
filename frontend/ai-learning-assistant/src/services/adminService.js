import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const wrap = async (request, fallback) => {
  try {
    const response = await request();
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: fallback };
  }
};

const getOverview = () =>
  wrap(() => axiosInstance.get(API_PATHS.ADMIN.OVERVIEW), 'Failed to load the overview');

const getStudents = (params) =>
  wrap(() => axiosInstance.get(API_PATHS.ADMIN.STUDENTS, { params }), 'Failed to load students');

const getStudent = (id) =>
  wrap(() => axiosInstance.get(API_PATHS.ADMIN.STUDENT(id)), 'Failed to load this student');

const getStruggles = () =>
  wrap(() => axiosInstance.get(API_PATHS.ADMIN.STRUGGLES), 'Failed to load struggle data');

const sendAnnouncement = (title, message) =>
  wrap(() => axiosInstance.post(API_PATHS.ADMIN.ANNOUNCEMENTS, { title, message }), 'Failed to send the announcement');

const adminService = { getOverview, getStudents, getStudent, getStruggles, sendAnnouncement };

export default adminService;
