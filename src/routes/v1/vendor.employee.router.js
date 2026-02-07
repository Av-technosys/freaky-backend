import { Router } from 'express';
import { db } from '../../../db/db.js';
 
import {  eq } from 'drizzle-orm'; 
import { checkVendor } from '../../middleware/vendor.middleware.js';
import { priceBook } from '../../../db/schema.js';
import { createVendorEmployeeInvitation, deleteVendorEmployee, getEmployeePermissions, getVendorEmployees, updateEmployeePermissions } from '../../controllers/Vendor.controllers.js';
 const vendorEmployeeRouter = Router();

vendorEmployeeRouter.get('/',  getVendorEmployees);
vendorEmployeeRouter.delete('/:id',  deleteVendorEmployee);
vendorEmployeeRouter.post('/invite',  createVendorEmployeeInvitation);
vendorEmployeeRouter.get('/permissions/:employeeId',  getEmployeePermissions);
vendorEmployeeRouter.put('/permissions/:employeeId',  updateEmployeePermissions);

export default vendorEmployeeRouter;
