import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const list = async () => {
  const response = await axiosInstance.get(API_PATHS.NOTIFICATIONS.LIST);
  return response.data;
};

const markRead = (id) => axiosInstance.patch(API_PATHS.NOTIFICATIONS.READ(id));
const markAllRead = () => axiosInstance.patch(API_PATHS.NOTIFICATIONS.READ_ALL);
const remove = (id) => axiosInstance.delete(API_PATHS.NOTIFICATIONS.DELETE(id));
const clear = () => axiosInstance.delete(API_PATHS.NOTIFICATIONS.CLEAR);

const notificationService = { list, markRead, markAllRead, remove, clear };

export default notificationService;
