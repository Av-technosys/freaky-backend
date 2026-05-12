import { Router } from 'express';

import { getVendorNotifications } from '../../controllers/Vendor.controllers.js';
import { checkVendor } from '../../middleware/vendor.middleware.js';
const vendorNotificationRouter = Router();

vendorNotificationRouter.get('/', checkVendor, getVendorNotifications);

export default vendorNotificationRouter;
