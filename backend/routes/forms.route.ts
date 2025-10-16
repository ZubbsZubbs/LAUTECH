import { Router } from 'express';
import {
  getAvailableForms,
  downloadForm,
  getFormCategories
} from '../controllers/forms.controller';

const router = Router();

// Public routes
router.get('/', getAvailableForms);
router.get('/categories', getFormCategories);
router.get('/download/:formId', downloadForm);

export default router;
