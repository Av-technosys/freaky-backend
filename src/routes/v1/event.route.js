import { Router } from 'express';
import { confirmUserToken } from '../../middleware/user.middleware.js';
import {
  createEvent,
  createEventItem,
  deleteEventItem,
  listAllEventTypes,
  listAllServicesByEventTypeId,
} from '../../controllers/Event.controller.js';

const router = Router();

router.post('/create_event', confirmUserToken, createEvent);
router.get('/event_type', confirmUserToken, listAllEventTypes);
router.get(
  '/service_type/:eventTypeId',
  confirmUserToken,
  listAllServicesByEventTypeId
);
router.post('/create_eventItem', confirmUserToken, createEventItem);
router.delete('/delete_eventItem/:itemId', confirmUserToken, deleteEventItem);

export default router;
