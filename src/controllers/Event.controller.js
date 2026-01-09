import { asc, eq } from 'drizzle-orm';
import {
  eventProductType,
  events,
  eventType,
  productTypes,
  featuredEvents,
  featuredBanners,
} from '../../db/schema.js';
import { createBookingDraft } from '../helpers/createBookingDraft.js';

export const createEvent = async (req, res) => {
  try {
    const userId = req.user['custom:user_id'];
    const {
      eventTypeId,
      name,
      description,
      contactNumber,
      eventDate,
      minGuestCount,
      maxGuestCount,
      latitude,
      longitude,
    } = req.body;

    await db.insert(events).values({
      eventTypeId: eventTypeId,
      userId: userId,
      name: name,
      description: description,
      contactNumber: contactNumber,
      eventDate: new Date(eventDate).toISOString(),
      minGuestCount: minGuestCount,
      maxGuestCount: maxGuestCount,
      latitude: latitude,
      longitude: longitude,
    });

    return res.status(201).json({
      message: 'Event created successfully...',
    });
  } catch (error) {
    console.error('Error: ', error);
    return res.status(500).json({ message: error.message });
  }
};

export const editEvent = async (req, res) => {
  try {
    const {
      eventId,
      eventTypeId,
      name,
      description,
      contactNumber,
      eventDate,
      minGuestCount,
      maxGuestCount,
      latitude,
      longitude,
    } = req.body;

    const data = await db
      .update(events)
      .set({
        eventTypeId,
        name,
        description,
        contactNumber,
        eventDate,
        minGuestCount,
        maxGuestCount,
        latitude,
        longitude,
      })
      .where(eq(events.eventId, eventId))
      .returning();

    return res.status(201).json({
      message: 'Event updated successfully...',
      data: data,
    });
  } catch (error) {
    console.error('Error: ', error);
    return res.status(500).json({ message: error.message });
  }
};

export const listAllEvents = async (req, res) => {
  try {
    const { eventid } = req.params;
    if (eventid) {
      const event = await db
        .select()
        .from(events)
        .where(eq(events.eventId, eventid));
      return res.status(200).json({
        message: 'Event details Fetched Successfully.',
        data: event,
      });
    } else {
      const event = await db.select().from(events).orderBy(asc(events.eventId));
      return res.status(200).json({
        message: 'Events Fetched Successfully.',
        data: event,
      });
    }
  } catch (error) {
    console.error('Error: ', error);
    return res.status(500).json({ message: error.message });
  }
};

export const listAllEventTypes = async (req, res) => {
  try {
    const response = await db
      .select()
      .from(eventType)
      .orderBy(asc(eventType.name));

    return res.status(200).json({
      message: 'Event Type Fetched Successfully...',
      data: response,
    });
  } catch (error) {
    console.error('Error: ', error);
    return res.status(500).json({ message: error.message });
  }
};

export const listAllServicesByEventTypeId = async (req, res) => {
  try {
    const { eventTypeId } = req.params;

    const eventServices = await db
      .select()
      .from(eventProductType)
      .where(eq(eventProductType.eventTypeId, eventTypeId))
      .orderBy(asc(eventProductType.id))
      .innerJoin(
        productTypes,
        eq(productTypes.id, eventProductType.productTypeId)
      )
      .then((res) => res.map((r) => r.product_types));

    return res.status(200).json({
      message: 'Services Fetched successfully...',
      data: eventServices,
    });
  } catch (error) {
    console.error('Error: ', error);
    return res.status(500).json({ message: error.message });
  }
};

export const createEventItem = async (req, res) => {
  try {
    const { eventId, productId, quantity } = req.body;

    if (!eventId || !productId) {
      return res.status(400).json({
        message: 'eventId and productId are required',
      });
    }

    const item = await createBookingDraft({
      source: 'EVENT',
      sourceId: eventId,
      productId,
      quantity,
      status: 'HOLD',
    });

    return res.status(201).json({
      message: 'Event item created successfully',
      data: item,
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteEventItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user['custom:user_id'];

    const bookingItem = await db
      .select()
      .from(bookingDraft)
      .where(eq(bookingDraft.bookingDraftId, itemId));

    if (!bookingItem.length) {
      return res.status(404).json({
        message: 'Event item not found.',
      });
    }

    const item = bookingItem[0];

    if (item.source !== 'EVENT') {
      return res.status(400).json({
        message: 'Invalid booking source.',
      });
    }

    const event = await db
      .select({ userId: events.userId })
      .from(events)
      .where(eq(events.eventId, item.sourceId));

    if (!event.length || event[0].userId !== userId) {
      return res.status(401).json({
        message: 'You are not authorized to delete this event item.',
      });
    }

    // // recheck  that what status are  allowed to be delete
    // if (item.bookingStatus !== 'HOLD') {
    //   return res.status(400).json({
    //     message: 'Only HOLD event items can be deleted.',
    //   });
    // }

    await db
      .delete(bookingDraft)
      .where(eq(bookingDraft.bookingDraftId, itemId));

    return res.status(200).json({
      message: 'Event item deleted successfully.',
    });
  } catch (error) {
    console.error('Error: ', error);
    return res.status(500).json({ message: error.message });
  }
};

export const getFeaturedEvents = async (req, res) => {
  try {
    const events = await db.select().from(featuredEvents);

    return res.status(200).json({
      success: true,
      data: events,
    });
  } catch (err) {
    console.error('Error fetching featured events:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch featured events',
    });
  }
};

export const getBanner = async (req, res) => {
  const response = await db
    .select()
    .from(featuredBanners)
    .orderBy(asc(featuredBanners.priority));
  try {
    return res.status(200).json({
      success: true,
      message: 'All Banner fetched successfully',
      data: response,
      count: response.length,
    });
  } catch (error) {
    console.error('Error', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
