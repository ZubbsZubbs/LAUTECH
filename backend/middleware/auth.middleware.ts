import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { UserService } from "../services/user.service";
import { UserRole } from "../models/User";
import dotenv from "dotenv";
dotenv.config();

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        username?: string;
        role: UserRole;
    };
}

export const authMiddleware = (userService: UserService) => {
    return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
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
            const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
            const user = await UserService.getUserById(decoded.userId);

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
        } catch (error) {
            res.status(401).json({
                statusCode: 401,
                message: "Invalid token"
            });
        }
    };
};

export const adminMiddleware: RequestHandler = (req, res, next) => {
    const authReq = req as AuthRequest;
    if (!authReq.user || authReq.user.role !== UserRole.ADMIN) {
        res.status(403).json({
            statusCode: 403,
            message: "Access denied. Admin role required."
        });
        return;
    }
    next();
};