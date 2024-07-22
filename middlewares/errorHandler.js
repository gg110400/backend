// Middleware per errore 400
export const error400Handler = (err, req, res, next) => {
    if (err.status === 400 || err.name === 'ValidationError') {
        res.status(400).json({ message: 'Bad Request' });
    } else {
        next(err);
    }
};

// Middleware per errore 401
export const error401Handler = (err, req, res, next) => {
    if (err.status === 401) {
        res.status(401).json({ message: 'Unauthorized' });
    } else {
        next(err);
    }
};

// Middleware per errore 404
export const error404Handler = (err, req, res, next) => {
    if (err.status === 404) {
        res.status(404).json({ message: 'Not Found' });
    } else {
        next(err);
    }
};

// Middleware per errore 500
export const error500Handler = ( err,req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
};

// Export default
export default {
    error400Handler,
    error401Handler,
    error404Handler,
    error500Handler
};