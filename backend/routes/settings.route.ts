import { Router } from "express";
import { Request, Response } from "express";
import Settings from "../models/Settings";
import { 
  getSettings, 
  updateProfileSettings, 
  updateHospitalSettings, 
  updateNotificationSettings, 
  updateSecuritySettings, 
  updateSystemSettings, 
  changePassword, 
  updateAllSettings 
} from "../controllers/settings.controller";

const router = Router();

// Save user settings
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, ...settingsData } = req.body;
    
    // Find existing settings or create new ones
    let settings = await Settings.findOne({ userId });
    
    if (settings) {
      // Update existing settings
      Object.assign(settings, settingsData);
      await settings.save();
    } else {
      // Create new settings
      settings = new Settings({
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
  } catch (error) {
    console.error("Save settings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save settings",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Get user settings
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User ID is required"
      });
      return;
    }

    const settings = await Settings.findOne({ userId });
    
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
  } catch (error) {
    console.error("Get settings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get settings",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Additional routes from controller
router.get("/:userId", getSettings as any);
router.put("/:userId/profile", updateProfileSettings as any);
router.put("/:userId/hospital", updateHospitalSettings as any);
router.put("/:userId/notifications", updateNotificationSettings as any);
router.put("/:userId/security", updateSecuritySettings as any);
router.put("/:userId/system", updateSystemSettings as any);
router.put("/:userId/password", changePassword as any);
router.put("/:userId", updateAllSettings as any);

export default router;