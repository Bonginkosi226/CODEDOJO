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
        // true for missions completed after required practice was introduced.
        // Entries created before that have no value here, so they are treated
        // as fully complete and existing students are never locked out.
        practiceRequired: {
            type: Boolean,
            default: false
        },
        completedAt: {
            type: Date,
            default: Date.now
        }
    }],
    // One entry per practice problem the student has attempted. `attempts`
    // counts FAILED attempts only; `completedAt` is null until first pass.
    completedPractice: [{
        lessonId: {
            type: String,
            required: true
        },
        practiceId: {
            type: String,
            required: true
        },
        code: {
            type: String,
            default: ''
        },
        attempts: {
            type: Number,
            default: 0
        },
        completedAt: {
            type: Date,
            default: null
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