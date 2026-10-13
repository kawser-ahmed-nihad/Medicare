export function notFound(req, res, next) {
    res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
    console.error(err);

    // Handle duplicate-key errors from MongoDB's unique email index.
    if (err.code === 11000) {
        return res.status(409).json({ success: false, message: "Email is already registered" });
    }

    const status = err.statusCode || 500;
    res.status(status).json({
        success: false,
        message: status === 500 ? "Something went wrong on our end" : err.message,
    });
}