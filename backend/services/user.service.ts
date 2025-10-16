import { IUser } from "../models/User";
import User from "../models/User";
import { generate2FACode } from "../utils/handleValidationHandler";

export class UserService {
    static async getUserById(id: string): Promise<IUser | null> {
        return await User.findById(id);
    }

    static async getUserByEmail(email: string): Promise<IUser | null> {
        return await User.findOne({ email });
    }

    static async createUser(userData: Partial<IUser>): Promise<IUser> {
        const user = new User(userData);
        return await user.save();
    }

    static async updateUser(id: string, userData: Partial<IUser>): Promise<IUser | null> {
        return await User.findByIdAndUpdate(id, userData, { new: true });
    }

    static async deleteUser(id: string): Promise<boolean> {
        const result = await User.findByIdAndDelete(id);
        return result !== null;
    }

    static async getAllUsers(): Promise<IUser[]> {
        return await User.find();
    }

    // Additional methods for specific functionality
    static async addBankAccount(userId: string, accountData: any): Promise<IUser | null> {
        const user = await User.findById(userId);
    if (!user) return null;

        if (!user.bankDetails) {
            user.bankDetails = [];
        }

        user.bankDetails.push(accountData);
        return await user.save();
    }

    static async removeBankAccount(userId: string, accountNumber: string): Promise<IUser | null> {
        const user = await User.findById(userId);
        if (!user) return null;

        if (user.bankDetails) {
            user.bankDetails = user.bankDetails.filter(
                (acct: any) => acct.accountNumber !== accountNumber
            );
        }

        return await user.save();
    }

    static async addSkill(userId: string, skill: any): Promise<IUser | null> {
        const user = await User.findById(userId);
    if (!user) return null;

    if (!user.skills) {
      user.skills = [];
    }

        const existing = user.skills.find((s: any) => s.title === skill.title);
        if (!existing) {
            user.skills.push(skill);
        }

        return await user.save();
    }

    static async removeSkill(userId: string, title: string): Promise<IUser | null> {
        const user = await User.findById(userId);
        if (!user) return null;

        if (user.skills) {
            user.skills = user.skills.filter((skill: any) => skill.title !== title);
        }

        return await user.save();
    }

    static async addCertificate(userId: string, certificate: any): Promise<IUser | null> {
        const user = await User.findById(userId);
    if (!user) return null;

        if (!user.certificates) {
            user.certificates = [];
        }

        user.certificates.push(certificate);
        return await user.save();
    }

    static async removeCertificate(userId: string, title: string): Promise<IUser | null> {
        const user = await User.findById(userId);
        if (!user) return null;

        if (user.certificates) {
            user.certificates = user.certificates.filter(
                (cert: any) => cert.title !== title
            );
        }

        return await user.save();
    }

    static async addExperience(userId: string, experience: any): Promise<IUser | null> {
        const user = await User.findById(userId);
    if (!user) return null;

        if (!user.experience) {
            user.experience = [];
        }

        user.experience.push(experience);
        return await user.save();
    }

    static async removeExperience(userId: string, title: string): Promise<IUser | null> {
        const user = await User.findById(userId);
        if (!user) return null;

        if (user.experience) {
            user.experience = user.experience.filter((exp: any) => exp.title !== title);
        }

        return await user.save();
    }

    static async addProject(userId: string, project: any): Promise<IUser | null> {
        const user = await User.findById(userId);
    if (!user) return null;

        if (!user.project) {
            user.project = [];
        }

        user.project.push(project);
        return await user.save();
    }

    static async removeProject(userId: string, projectName: string): Promise<IUser | null> {
        const user = await User.findById(userId);
        if (!user) return null;

        if (user.project) {
            user.project = user.project.filter((p: any) => p.name !== projectName);
        }

        return await user.save();
    }

    static async addSubscription(userId: string, subscription: any): Promise<IUser | null> {
        const user = await User.findById(userId);
    if (!user) return null;

        if (!user.subscriptions) {
            user.subscriptions = [];
        }

        user.subscriptions.push(subscription);
        return await user.save();
    }

    static async removeSubscription(userId: string, name: string): Promise<IUser | null> {
        const user = await User.findById(userId);
    if (!user) return null;

        if (user.subscriptions) {
            user.subscriptions = user.subscriptions.filter(
                (sub: any) => sub.name !== name
            );
        }

        return await user.save();
    }
}