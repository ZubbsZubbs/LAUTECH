"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Settings_1 = __importDefault(require("../models/Settings"));
const router = (0, express_1.Router)();
// Save user settings
router.post("/", async (req, res) => {
    try {
        const { userId, ...settingsData } = req.body;
        // Find existing settings or create new ones
        let settings = await Settings_1.default.findOne({ userId });
        if (settings) {
            // Update existing settings
            Object.assign(settings, settingsData);
            await settings.save();
        }
        else {
            // Create new settings
            settings = new Settings_1.default({
                userId,
                ...settingsData
            });
            await settings.save();
        }
        res.status(200).json({
            success: true,
            message: "Settings saved successfully",
            data: settings
        });
    }
    catch (error) {
        console.error("Save settings error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to save settings",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});
// Get user settings
router.get("/", async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            res.status(400).json({
                success: false,
                message: "User ID is required"
            });
            return;
        }
        const settings = await Settings_1.default.findOne({ userId });
        if (!settings) {
            res.status(404).json({
                success: false,
                message: "Settings not found"
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: settings
        });
    }
    catch (error) {
        console.error("Get settings error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get settings",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});
exports.default = router;
