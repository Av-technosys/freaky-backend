import { Router } from 'express';
import { createVendorEmployeeInvitation, deleteVendorEmployee, getEmployeePermissions, getVendorEmployees, updateEmployeePermissions } from '../../controllers/Vendor.controllers.js';
const vendorEmployeeRouter = Router();

vendorEmployeeRouter.get('/', getVendorEmployees);
vendorEmployeeRouter.delete('/:id', deleteVendorEmployee);
vendorEmployeeRouter.post('/invite', createVendorEmployeeInvitation);
vendorEmployeeRouter.get('/permissions/:employeeId', getEmployeePermissions);
vendorEmployeeRouter.put('/permissions/:empUserId', updateEmployeePermissions);

export default vendorEmployeeRouter;
