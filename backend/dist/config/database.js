"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || process.env.DB_URL || 'mongodb://localhost:27017/lautech-hospital';
        // Add connection options to prevent timeouts
        const options = {
            serverSelectionTimeoutMS: 30000, // 30 seconds
            socketTimeoutMS: 45000, // 45 seconds
            maxPoolSize: 10,
            minPoolSize: 5,
            maxIdleTimeMS: 30000,
            retryWrites: true
        };
        await mongoose_1.default.connect(mongoURI, options);
        console.log('MongoDB connected successfully');
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        console.log('Server will continue without database connection. Please install MongoDB or configure MONGODB_URI environment variable.');
        // Don't exit the process, let the server start without database
    }
};
exports.connectDB = connectDB;
