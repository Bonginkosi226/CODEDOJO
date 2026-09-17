import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: {
        type : String,
        required: [true, 'Please provide a username'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 character long']
    },

   email: {
  type: String,
  required: [true, 'Please provide an email'],
  unique: true,
  lowercase: true,
  match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
},

password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
},


    profileImage: {
        type: String,
        default: null
    },
    // Gamification properties
    xp: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    },
    badges: [{
        name: String,
        icon: String,
        dateAwarded: {
            type: Date,
            default: Date.now
        }
    }],
    arcadeProgress: {
        type: Number,
        default: 0
    },
    completedLessons: [{
        lessonId: {
            type: String,
            required: true
        },
        language: {
            type: String,
            enum: ['python', 'java'],
            required: true
        },
        title: String,
        code: String,
        completedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});


//Hash password before saving

userSchema.pre('save', async function() {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;