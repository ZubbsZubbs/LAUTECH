"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const User_1 = __importDefault(require("../models/User"));
class UserService {
    static async getUserById(id) {
        return await User_1.default.findById(id);
    }
    static async getUserByEmail(email) {
        return await User_1.default.findOne({ email });
    }
    static async createUser(userData) {
        const user = new User_1.default(userData);
        return await user.save();
    }
    static async updateUser(id, userData) {
        return await User_1.default.findByIdAndUpdate(id, userData, { new: true });
    }
    static async deleteUser(id) {
        const result = await User_1.default.findByIdAndDelete(id);
        return result !== null;
    }
    static async getAllUsers() {
        return await User_1.default.find();
    }
    // Additional methods for specific functionality
    static async addBankAccount(userId, accountData) {
        const user = await User_1.default.findById(userId);
        if (!user)
            return null;
        if (!user.bankDetails) {
            user.bankDetails = [];
        }
        user.bankDetails.push(accountData);
        return await user.save();
    }
    static async removeBankAccount(userId, accountNumber) {
        const user = await User_1.default.findById(userId);
        if (!user)
            return null;
        if (user.bankDetails) {
            user.bankDetails = user.bankDetails.filter((acct) => acct.accountNumber !== accountNumber);
        }
        return await user.save();
    }
    static async addSkill(userId, skill) {
        const user = await User_1.default.findById(userId);
        if (!user)
            return null;
        if (!user.skills) {
            user.skills = [];
        }
        const existing = user.skills.find((s) => s.title === skill.title);
        if (!existing) {
            user.skills.push(skill);
        }
        return await user.save();
    }
    static async removeSkill(userId, title) {
        const user = await User_1.default.findById(userId);
        if (!user)
            return null;
        if (user.skills) {
            user.skills = user.skills.filter((skill) => skill.title !== title);
        }
        return await user.save();
    }
    static async addCertificate(userId, certificate) {
        const user = await User_1.default.findById(userId);
        if (!user)
            return null;
        if (!user.certificates) {
            user.certificates = [];
        }
        user.certificates.push(certificate);
        return await user.save();
    }
    static async removeCertificate(userId, title) {
        const user = await User_1.default.findById(userId);
        if (!user)
            return null;
        if (user.certificates) {
            user.certificates = user.certificates.filter((cert) => cert.title !== title);
        }
        return await user.save();
    }
    static async addExperience(userId, experience) {
        const user = await User_1.default.findById(userId);
        if (!user)
            return null;
        if (!user.experience) {
            user.experience = [];
        }
        user.experience.push(experience);
        return await user.save();
    }
    static async removeExperience(userId, title) {
        const user = await User_1.default.findById(userId);
        if (!user)
            return null;
        if (user.experience) {
            user.experience = user.experience.filter((exp) => exp.title !== title);
        }
        return await user.save();
    }
    static async addProject(userId, project) {
        const user = await User_1.default.findById(userId);
        if (!user)
            return null;
        if (!user.project) {
            user.project = [];
        }
        user.project.push(project);
        return await user.save();
    }
    static async removeProject(userId, projectName) {
        const user = await User_1.default.findById(userId);
        if (!user)
            return null;
        if (user.project) {
            user.project = user.project.filter((p) => p.name !== projectName);
        }
        return await user.save();
    }
    static async addSubscription(userId, subscription) {
        const user = await User_1.default.findById(userId);
        if (!user)
            return null;
        if (!user.subscriptions) {
            user.subscriptions = [];
        }
        user.subscriptions.push(subscription);
        return await user.save();
    }
    static async removeSubscription(userId, name) {
        const user = await User_1.default.findById(userId);
        if (!user)
            return null;
        if (user.subscriptions) {
            user.subscriptions = user.subscriptions.filter((sub) => sub.name !== name);
        }
        return await user.save();
    }
}
exports.UserService = UserService;
