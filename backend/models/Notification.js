import mongoose from 'mongoose';

// One document per recipient. Announcements fan out to every student.
const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 120
    },
    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000
    },
    category: {
        type: String,
        enum: ['system', 'achievements'],
        default: 'system'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    readAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

notificationSchema.index({ userId: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
