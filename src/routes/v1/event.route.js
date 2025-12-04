import { Router } from 'express';
import { confirmUserToken } from '../../middleware/user.middleware.js';
import {
  createEvent,
  listAllEventTypes,
  listAllServicesByEventTypeId,
} from '../../controllers/Event.controller.js';

const router = Router();

router.post('/create_event', confirmUserToken, createEvent);
router.get('/list_all_event_types', confirmUserToken, listAllEventTypes);
router.get(
  '/list_all_services_by_eventTypeId/:eventTypeId',
  confirmUserToken,
  listAllServicesByEventTypeId
);

export default router;
