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
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
const firebaseConfig = {
    apiKey: process.env.DOMAIN_FIREBASE_API_KEY,
    authDomain: process.env.DOMAIN_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.DOMAIN_FIREBASE_PROJECT_ID,
};
(0, app_1.initializeApp)(firebaseConfig);
const app = (0, express_1.default)();
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, postman)
        if (!origin)
            return callback(null, true);
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:3002',
            process.env.FRONTEND_URL,
            'https://lautech-edu-ng.onrender.com'
        ].filter(Boolean);
        // Allow any origin that includes lautech or is localhost
        if (allowedOrigins.indexOf(origin) !== -1 ||
            origin.includes('localhost') ||
            origin.includes('lautech') ||
            origin.includes('vercel.app') ||
            origin.includes('netlify.app') ||
            origin.includes('render.com')) {
            callback(null, true);
        }
        else {
            callback(null, true); // For now, allow all origins in production
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Disposition']
};
app.use((0, cors_1.default)(corsOptions));
app.use('/public', express_1.default.static(path_1.default.join(__dirname, 'public')));
// Middleware
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:", "https://lautech-edu-ng.onrender.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https:"],
            scriptSrc: ["'self'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        },
    },
}));
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
// Serve uploaded files with proper headers
// Try multiple possible upload directories (for development and production)
const uploadsPaths = [
    path_1.default.join(__dirname, 'uploads'), // When running from dist/
    path_1.default.join(__dirname, '..', 'uploads'), // When running from dist/ (go up one level)
    path_1.default.join(process.cwd(), 'uploads'), // From project root
    path_1.default.join(process.cwd(), 'backend', 'uploads') // From project root with backend folder
];
// Find the first existing uploads directory
let uploadsPath = uploadsPaths[0];
for (const testPath of uploadsPaths) {
    if (fs_1.default.existsSync(testPath)) {
        uploadsPath = testPath;
        console.log('✅ Found uploads directory at:', uploadsPath);
        break;
    }
}
console.log('📁 Using uploads directory:', uploadsPath);
console.log('📁 Current __dirname:', __dirname);
console.log('📁 Current process.cwd():', process.cwd());
app.use('/uploads', (req, res, next) => {
    console.log('📁 Upload request:', {
        url: req.url,
        path: req.path,
        fullPath: path_1.default.join(uploadsPath, req.path)
    });
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    res.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
    res.header('Cache-Control', 'public, max-age=31536000');
    next();
}, express_1.default.static(uploadsPath, {
    setHeaders: (res, filePath) => {
        console.log('📄 Serving file:', filePath);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
    }
}));
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
// Email diagnostic endpoint
app.get('/test-email', async (req, res) => {
    try {
        const EmailService = require('./email/email.service').default;
        const diagnostics = {
            emailConfigured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS),
            emailUser: process.env.EMAIL_USER ? '✅ SET' : '❌ NOT SET',
            emailPass: process.env.EMAIL_PASS ? '✅ SET (hidden)' : '❌ NOT SET',
            emailFrom: process.env.EMAIL_FROM || 'Not set',
            testResult: null
        };
        // Try to send a test email
        if (diagnostics.emailConfigured) {
            try {
                const result = await EmailService.sendEmail(process.env.EMAIL_USER, 'Test Email from Live Server', 'This is a test email to verify email configuration on production.', '<h2>Test Email</h2><p>This is a test email to verify email configuration on production.</p>');
                diagnostics.testResult = {
                    status: 'SUCCESS',
                    messageId: result.messageId,
                    response: result.response
                };
            }
            catch (emailError) {
                diagnostics.testResult = {
                    status: 'FAILED',
                    error: emailError instanceof Error ? emailError.message : 'Unknown error'
                };
            }
        }
        else {
            diagnostics.testResult = {
                status: 'SKIPPED',
                reason: 'Email credentials not configured'
            };
        }
        res.json(diagnostics);
    }
    catch (error) {
        res.status(500).json({
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Uploads directory diagnostic endpoint
app.get('/test-uploads', (req, res) => {
    const testFile = req.query.file || 'birthCertificate-1760282176496-60228965.pdf';
    const testPath = req.query.path || 'applications';
    const diagnostics = {
        requestedFile: testFile,
        requestedPath: testPath,
        __dirname: __dirname,
        processCwd: process.cwd(),
        uploadsPath: uploadsPath,
        possiblePaths: uploadsPaths,
        fileChecks: {}
    };
    // Check if file exists in various locations
    const possibleFilePaths = [
        path_1.default.join(uploadsPath, testPath, testFile),
        path_1.default.join(__dirname, 'uploads', testPath, testFile),
        path_1.default.join(__dirname, '..', 'uploads', testPath, testFile),
        path_1.default.join(process.cwd(), 'uploads', testPath, testFile),
        path_1.default.join(process.cwd(), 'backend', 'uploads', testPath, testFile)
    ];
    possibleFilePaths.forEach((filePath, index) => {
        diagnostics.fileChecks[`path${index + 1}`] = {
            path: filePath,
            exists: fs_1.default.existsSync(filePath),
            isFile: fs_1.default.existsSync(filePath) ? fs_1.default.statSync(filePath).isFile() : false
        };
    });
    // List files in uploads directory
    try {
        const uploadsDir = path_1.default.join(uploadsPath, testPath);
        if (fs_1.default.existsSync(uploadsDir)) {
            diagnostics.fileChecks.filesInDirectory = fs_1.default.readdirSync(uploadsDir).slice(0, 10); // First 10 files
        }
    }
    catch (error) {
        diagnostics.fileChecks.directoryError = error instanceof Error ? error.message : 'Unknown error';
    }
    res.json(diagnostics);
});
// Error handling
app.use(error_handler_middleware_1.errorHandler);
exports.default = app;
