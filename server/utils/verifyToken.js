import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

export const verifyToken = (req, res, next) => {

    const token = req.cookies.access_token;
    if (!token) {
        console.log("verifyToken: no token");
        return next(createError(401, "You are not authenticated!"));
    }

    jwt.verify(token, process.env.JWT, (err, user) => {
        if (err) return next(createError(403, "Token is not valid!"));
        req.user = user;
        next();
    });
};

export const verifyClient = (req, res, next) => {
    verifyToken(req, res, () => {
        console.log("verifyClient: req.user.id:", req.user.id);
        console.log("verifyClient: req.params.id:", req.params.userId);
        
        if ((req.user.id === req.params.userId && req.user.role == "Client") || req.user.role == "Admin") {
            next();
        } else {
            return next(createError(403, "You are not authorized!"));
        }
    });
};

export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role == "Admin") {
            next();
        } else {
            return next(createError(403, "You are not authorized!"));
        }
    });
};
