import jwt from 'jsonwebtoken';

//creo token jwt
export const generateJWT = (payload) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' }, (err, token) => { // Modificato per usare JWT_SECRET
            if (err) {
                reject(err);
            } else {
                resolve(token);
            }
        });
    });
};

//verifico il token jwt
export const verifyJWT = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
};