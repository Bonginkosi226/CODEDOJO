import crypto from 'crypto';
import jwt from "jsonwebtoken";
import { validationResult } from 'express-validator';
import User from '../models/User.js';
import { sendPasswordResetEmail } from '../services/emailService.js';

//Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || "7d",
    });
} ;

//@desc Login user
// @route POST /api/auth/register
// @access Public
export const register = async (req, res, next) => {
    try {
        // Check validation results
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: errors.array().map(e => e.msg).join(', '),
                statusCode: 400
            });
        }

        const { username, email, password } = req.body;

        //check if user exist (both email AND username)
        const userExists = await User.findOne({ $or: [{ email }, { username }] });

        if(userExists) {
           return res.status(400).json({
            success: false,
            error: 
            userExists.email === email? "Email already registered"
            : "Username already taken",
            statusCode: 400,
           });
        }

        //Create user
        //User.create() internally DOES new User() + user.save()
        const user = await User.create({
            username,
            email,
            password
        });

        //Generate Token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    profileImage: user.profileImage,
                    xp: user.xp,
                    level: user.level,
                    role: user.role,
                    createdAt: user.createdAt
                },
                token
                
            },
            message: "User registered successfully"
        });

    } catch(error) {
        next(error);
    }
};



//@desc Login user
// @route POST /api/auth/login
// @access Public

export const login = async (req, res, next) => {
    try {
        // Check validation results
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: errors.array().map(e => e.msg).join(', '),
                statusCode: 400
            });
        }

        const { email, password } = req.body;
       // console.log("REQ PASSWORD:", password);

        //Validate input
        if (!email || !password){
            return res.status(400).json({
                success: false,
                error: "Please provide email and password",
                statusCode: 400
            });
        }

        //check for user (include password for comparison)
        const user = await User.findOne({ email }).select('+password');
        if(!user) {
            return res.status(401).json({
                success: false,
                error: "invalid credentials",
                statusCode: 401
            });
        }
       // console.log("DB PASSWORD:", user.password);

        const isMatch = await user.matchPassword(password);

        if(!isMatch) {
            return res.status(401).json({
                success: false,
                error: "Invalid credentials",
                statusCode: 401
            });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                xp: user.xp,
                level: user.level,
                role: user.role
            },
            token,
            message: "Login successful",
        });

    } catch(error) {
        next(error);
    }
};


//@desc Get User Profile
// @route GET /api/auth/profile
// @access Private

export const getProfile = async (req, res, next) => {
    try {

        const user = await User.findById(req.user._id);

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                username:  user.username,
                email: user.email,
                profileImage: user.profileImage,
                xp: user.xp,
                level: user.level,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },
        });

    } catch(error) {
        next(error);
    }
};


//@desc Update User Profile
// @route PUT /api/auth/profile
// @access Private

export const updateProfile = async (req, res, next) => {
    try {

        const { username, email, profileImage } = req.body;

        const user = await User.findById(req.user._id);

        if(username) user.username = username;
        if(email) user.email = email;
        if(profileImage) user.profileImage = profileImage;


        await user.save();

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage
            },
            message: "Profile updated successfully"
        });
    } catch(error) {
        next(error);
    }
};


//@desc Change password
// @route POST /api/auth/change-password
// @access Private

export const changePassword = async (req, res, next) => {
    try {
       const { currentPassword, newPassword } = req.body;
       
       if(!currentPassword || !newPassword) {
        return res.status(400).json({
            success: false,
            error: "Please provide current and new password",
            statusCode: 400
        });
       }

       const user = await User.findById(req.user._id).select("+password");

       //check current password
       const isMatch = await user.matchPassword(currentPassword);

       if(!isMatch){
        return res.status(401).json({
            success: false,
            error: "Current password is incorrect",
            statusCode: 401
        });
       }

       user.password = newPassword;
       await user.save();

       res.status(200).json({
        success: true,
        message: "Password changed successfully",
       });

    } catch(error) {
        next(error);
    }
};


// ───────────────────────── Password reset by email ─────────────────────────

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

// The exact same message goes back whether or not the email has an account.
const FORGOT_PASSWORD_MESSAGE =
    'If an account with that email exists, we have sent a password reset link. It expires in 1 hour.';

const INVALID_RESET_LINK_MESSAGE =
    'This reset link is invalid or has expired. Please request a new one.';

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const frontendUrl = () => (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/+$/, '');

// Runs AFTER the response has been sent, so how long it takes (and whether it
// finds an account) can never be observed by the caller.
const issueResetLink = async (email) => {
    const user = await User.findOne({ email }).select('username email');
    if (!user) return;

    // 256 bits of randomness. Only the hash is stored; the raw token exists
    // only in the emailed link.
    const token = crypto.randomBytes(32).toString('hex');

    await User.updateOne(
        { _id: user._id },
        {
            $set: {
                passwordResetToken: hashToken(token),
                passwordResetExpires: new Date(Date.now() + RESET_TOKEN_TTL_MS),
            },
        }
    );

    try {
        await sendPasswordResetEmail({
            to: user.email,
            username: user.username,
            resetUrl: `${frontendUrl()}/reset-password/${token}`,
        });
    } catch (error) {
        // Email couldn't be sent: invalidate the token so it isn't left dangling.
        await User.updateOne(
            { _id: user._id },
            { $unset: { passwordResetToken: 1, passwordResetExpires: 1 } }
        );
        throw error;
    }
};

// @desc    Request a password reset link by email
// @route   POST /api/auth/forgot-password
// @access  Public (rate limited per IP and per email)
export const forgotPassword = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a valid email address',
                statusCode: 400
            });
        }

        // Always the same answer — no account enumeration.
        res.status(200).json({ success: true, message: FORGOT_PASSWORD_MESSAGE });

        issueResetLink(req.body.email).catch((error) => {
            console.error('[ForgotPassword] failed to issue reset link:', error.message);
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Set a new password using an emailed reset token
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;

        if (typeof newPassword !== 'string' || newPassword.length < MIN_PASSWORD_LENGTH) {
            return res.status(400).json({
                success: false,
                error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
                statusCode: 400
            });
        }
        if (newPassword.length > MAX_PASSWORD_LENGTH) {
            return res.status(400).json({
                success: false,
                error: `Password must be at most ${MAX_PASSWORD_LENGTH} characters long`,
                statusCode: 400
            });
        }

        // Tokens are 64 hex chars. Anything else can't be valid — same message as
        // an unknown or expired token, so callers learn nothing.
        if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) {
            return res.status(400).json({ success: false, error: INVALID_RESET_LINK_MESSAGE, statusCode: 400 });
        }

        // Atomically consume the token: only one request can ever win it, so a
        // token is single-use even if it is submitted twice at the same instant.
        const user = await User.findOneAndUpdate(
            { passwordResetToken: hashToken(token), passwordResetExpires: { $gt: new Date() } },
            { $unset: { passwordResetToken: 1, passwordResetExpires: 1 } }
        );

        if (!user) {
            return res.status(400).json({ success: false, error: INVALID_RESET_LINK_MESSAGE, statusCode: 400 });
        }

        user.password = newPassword;          // hashed by the model's pre-save hook
        user.passwordChangedAt = new Date();  // every token issued before now stops working
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Your password has been reset. You can now log in with your new password.'
        });
    } catch (error) {
        next(error);
    }
};


