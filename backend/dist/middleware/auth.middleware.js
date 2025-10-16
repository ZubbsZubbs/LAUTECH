"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_service_1 = require("../services/user.service");
const User_1 = require("../models/User");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const authMiddleware = (userService) => {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                res.status(401).json({
                    statusCode: 401,
                    message: "No authorization header"
                });
                return;
            }
            const token = authHeader.split(" ")[1];
            if (!token) {
                res.status(401).json({
                    statusCode: 401,
                    message: "No token provided"
                });
                return;
            }
            if (!process.env.JWT_SECRET) {
                res.status(500).json({
                    statusCode: 500,
                    message: "Server configuration error"
                });
                return;
            }
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const user = await user_service_1.UserService.getUserById(decoded.userId);
            if (!user) {
                res.status(401).json({
                    statusCode: 401,
                    message: "User not found"
                });
                return;
            }
            req.user = {
                id: user.id,
                email: user.email,
                username: user.email,
                role: user.role
            };
            next();
        }
        catch (error) {
            res.status(401).json({
                statusCode: 401,
                message: "Invalid token"
            });
        }
    };
};
exports.authMiddleware = authMiddleware;
const adminMiddleware = (req, res, next) => {
    const authReq = req;
    if (!authReq.user || authReq.user.role !== User_1.UserRole.ADMIN) {
        res.status(403).json({
            statusCode: 403,
            message: "Access denied. Admin role required."
        });
        return;
    }
    next();
};
exports.adminMiddleware = adminMiddleware;
