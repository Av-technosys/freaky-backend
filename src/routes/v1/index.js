import { Router } from 'express';

import auth from './auth.route.js';
import user from './user.route.js';
import vendor from './vendor.route.js';
import upload from './upload.route.js';
import event from './event.route.js';
import product from './product.route.js';
import admin from './admin.route.js';

const router = Router();

router.use('/auth', auth);
router.use('/user', user);
router.use('/vendor', vendor);
router.use('/upload', upload);
router.use('/event', event);
router.use('/product', product);
router.use('/admin', admin);

export default router;
