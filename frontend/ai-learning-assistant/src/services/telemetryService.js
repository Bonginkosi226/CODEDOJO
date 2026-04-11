import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

/**
 * Pushes raw telemetry bulk data to the backend.
 * Local batching will happen inside the React Context Provider 
 * to ensure that routing changes and React lifecycle events are captured easily.
 */
const pushBulkTelemetry = async (events) => {
  if (!events || events.length === 0) return { success: true };
  
  try {
    const response = await axiosInstance.post(API_PATHS.TELEMETRY.BULK, {
      events
    });
    return response.data;
  } catch (error) {
    // We swallow errors so telemetry failures don't crash the UI experience
    console.warn('Telemetry failed to push:', error);
    return { success: false };
  }
};

const telemetryService = {
  pushBulkTelemetry,
};

export default telemetryService;
