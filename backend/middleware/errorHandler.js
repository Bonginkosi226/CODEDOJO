const errorHandler = (err, req, res, next) => {
    // If a response was already started (e.g. by auth middleware), delegate to
    // Express's default error handler to avoid ERR_HTTP_HEADERS_SENT.
    if (res.headersSent) {
        return next(err);
    }

    console.error('SERVER ERROR:', err);

    let statusCode = err.statusCode || 500;
    let message = err.message || 'Server Error';

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        message = 'Resource not found';
        statusCode = 404;
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        message = `${field} already exists`;
        statusCode = 400;
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        message = Object.values(err.errors).map(val => val.message).join(', ');
        statusCode = 400;
    }

    // Multer error
    if (err.name === 'MulterError') {
        message = `Upload error: ${err.message}`;
        statusCode = 400;
    }

    res.status(statusCode).json({
        success: false,
        error: message,
        statusCode,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};
export default errorHandler;