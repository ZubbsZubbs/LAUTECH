"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const forms_controller_1 = require("../controllers/forms.controller");
const router = (0, express_1.Router)();
// Public routes
router.get('/', forms_controller_1.getAvailableForms);
router.get('/categories', forms_controller_1.getFormCategories);
router.get('/download/:formId', forms_controller_1.downloadForm);
exports.default = router;
