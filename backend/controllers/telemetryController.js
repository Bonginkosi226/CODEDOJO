import TelemetryEvent from '../models/TelemetryEvent.js';

// @desc    Bulk ingest telemetry events to save DB connections
// @route   POST /api/telemetry/bulk
// @access  Public (so we can track pre-login activities if we want)
export const logBulkTelemetry = async (req, res, next) => {
  try {
    const { events } = req.body;
    
    if (!events || !Array.isArray(events)) {
      return res.status(400).json({ success: false, error: 'Events array is required' });
    }

    // Attach user ID if available (from protect middleware if used, or null)
    let userId = null;
    if (req.user) {
      userId = req.user._id;
    }

    const eventsToInsert = events.map(event => ({
      ...event,
      userId: userId || event.userId || null,
      timestamp: event.timestamp || new Date()
    }));

    if (eventsToInsert.length > 0) {
      await TelemetryEvent.insertMany(eventsToInsert);
    }

    res.status(200).json({
      success: true,
      message: `${eventsToInsert.length} telemetry events logged`
    });

  } catch (error) {
    // We don't want telemetry failures to crash things or throw massive alarms 
    // unless it's a huge issue, but we must call next to handle it.
    console.error("Telemetry bulk insert error:", JSON.stringify(error, null, 2));
    next(error);
  }
};
