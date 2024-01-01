function errHandler(err , req , res , next) {
    if(err.name === 'UnauthorizedError') return res.status(401).json({
        message: 'The user isn\'t  authorized',
    });

    if(err.name === 'ValidationError') return res.status(401).json({
        message: err.message,
    });

    return res.status(500).json({
        message: err.message,
        error: err,
    });
};

module.exports = errHandler