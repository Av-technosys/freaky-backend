import { Router } from 'express';

import {  getVendorNotifications } from '../../controllers/Vendor.controllers.js';
 const vendorNotificationRouter = Router();

vendorNotificationRouter.get('/',  getVendorNotifications);

export default vendorNotificationRouter;
