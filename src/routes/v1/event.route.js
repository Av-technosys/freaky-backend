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
  editEvent,
  getBanner,
} from '../../controllers/Event.controller.js';

const router = Router();

router.post('/create', confirmUserToken, createEvent);
router.post('/edit', confirmUserToken, editEvent);
router.get('/event_type', listAllEventTypes);
router.get(
  '/service_type/:eventTypeId',
  listAllServicesByEventTypeId
);
router.post('/create_eventitem', confirmUserToken, createEventItem);
router.delete('/eventitem/:itemId', confirmUserToken, deleteEventItem);
router.get('/featured', getFeaturedEvents);
router.get('/banner', getBanner);
router.get('/:eventid?', confirmUserToken, listAllEvents);

export default router;
