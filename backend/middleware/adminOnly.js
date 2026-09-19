// Must run AFTER `protect` (which loads req.user). The role always comes from
// the database record, never from the request, so it cannot be spoofed.
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }

    return res.status(403).json({
        success: false,
        error: 'Admin access required',
        statusCode: 403
    });
};

export default adminOnly;
