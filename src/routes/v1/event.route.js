import { Router } from 'express';
import { confirmUserToken } from '../../middleware/user.middleware.js';
import {
  createEvent,
  createEventItem,
  deleteEventItem,
  listAllEvents,
  listAllEventTypes,
  listAllServicesByEventTypeId,
  getFeaturedEvents,
} from '../../controllers/Event.controller.js';

const router = Router();

router.post('/create', confirmUserToken, createEvent);
router.get('/event_type', confirmUserToken, listAllEventTypes);
router.get(
  '/service_type/:eventTypeId',
  confirmUserToken,
  listAllServicesByEventTypeId
);
router.post('/create_eventitem', confirmUserToken, createEventItem);
router.delete('/eventitem/:itemId', confirmUserToken, deleteEventItem);
router.get('/featured_events', confirmUserToken, getFeaturedEvents);
router.get('/:eventid?', confirmUserToken, listAllEvents);

export default router;
