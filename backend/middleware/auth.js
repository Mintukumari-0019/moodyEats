import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
    let token = req.headers.token;
    if (!token && req.headers.authorization) {
        const parts = req.headers.authorization.split(" ");
        if (parts.length === 2 && parts[0] === "Bearer") {
            token = parts[1];
        }
    }

    if (!token) {
        return res.json({ success: false, message: 'Not Authorized. Please sign in again.' });
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET || "default_jwt_secret");
        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        return res.json({ success: false, message: 'Session expired or invalid token. Please sign in.' });
    }
};

export default authMiddleware;
