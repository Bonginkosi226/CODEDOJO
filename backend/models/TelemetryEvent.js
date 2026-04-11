import mongoose from 'mongoose';

const telemetryEventSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow anonymous/unauthenticated tracking if desired
  },
  sessionId: {
    type: String,
    required: true
  },
  eventType: {
    type: String,
    enum: ['page_view', 'click', 'error', 'milestone', 'time_spent', 'quiz_response', 'arcade_action'],
    required: true
  },
  context: {
    type: String, 
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const TelemetryEvent = mongoose.model('TelemetryEvent', telemetryEventSchema);

export default TelemetryEvent;
