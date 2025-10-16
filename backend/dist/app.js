"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = require("firebase/app");
const user_route_1 = __importDefault(require("./routes/user.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const contact_route_1 = __importDefault(require("./routes/contact.route"));
const application_route_1 = __importDefault(require("./routes/application.route"));
const appointment_route_1 = __importDefault(require("./routes/appointment.route"));
const forms_route_1 = __importDefault(require("./routes/forms.route"));
const patient_route_1 = __importDefault(require("./routes/patient.route"));
const doctor_route_1 = __importDefault(require("./routes/doctor.route"));
const department_route_1 = __importDefault(require("./routes/department.route"));
const upload_route_1 = __importDefault(require("./routes/upload.route"));
const settings_route_1 = __importDefault(require("./routes/settings.route"));
const error_handler_middleware_1 = require("./middleware/error_handler.middleware");
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const firebaseConfig = {
    apiKey: process.env.DOMAIN_FIREBASE_API_KEY,
    authDomain: process.env.DOMAIN_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.DOMAIN_FIREBASE_PROJECT_ID,
};
(0, app_1.initializeApp)(firebaseConfig);
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:3000/linkedin-callback',
        process.env.FRONTEND_URL || 'http://localhost:3000'
    ],
    credentials: true
}));
app.use('/public', express_1.default.static(path_1.default.join(__dirname, 'public')));
// Middleware
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('combined'));
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api/user', user_route_1.default);
app.use('/api/auth', auth_route_1.default);
app.use('/api/contact', contact_route_1.default);
app.use('/api/applications', application_route_1.default);
app.use('/api/appointments', appointment_route_1.default);
app.use('/api/forms', forms_route_1.default);
app.use('/api/patients', patient_route_1.default);
app.use('/api/doctors', doctor_route_1.default);
app.use('/api/departments', department_route_1.default);
app.use('/api/upload', upload_route_1.default);
app.use('/api/settings', settings_route_1.default);
// Serve uploaded files
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
app.use((req, res, next) => {
    console.log('Request received:', {
        method: req.method,
        path: req.path,
        originalUrl: req.originalUrl,
        baseUrl: req.baseUrl,
        url: req.url
    });
    next();
});
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
// Database test endpoint
app.get('/test-db', async (req, res) => {
    try {
        const User = require('./models/User').default;
        const userCount = await User.countDocuments().maxTimeMS(5000);
        res.json({
            status: 'OK',
            database: 'Connected',
            userCount: userCount,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'ERROR',
            database: 'Connection failed',
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        });
    }
});
// Error handling
app.use(error_handler_middleware_1.errorHandler);
exports.default = app;
