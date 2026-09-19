import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export function isUser(req, res, next) {
    if (req.user != null) {
        next();
    } else {
        res.status(401).json({
            message: "Unauthorized: Please login first"
        })
    }
}

export function isAdmin(req, res, next) {
    if (req.user != null && req.user.role == "admin") {
        next();
    } else {
        res.status(403).json({
            message: "Forbidden: You are not authorized to perform this action"
        })
    }
}
