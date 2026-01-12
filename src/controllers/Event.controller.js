import { asc, eq } from 'drizzle-orm';
import {
  // eventItems,
  eventProductType,
  events,
  eventType,
  productTypes,
  featuredEvents,
  featuredBanners,
} from '../../db/schema.js';
import { createBookingDraft } from '../helpers/createBookingDraft.js';
import { SOURCE, STATUS } from '../../const/global.js';

import { db } from '../../db/db.js';
export const createEvent = async (req, res) => {
  try {
    const userId = req.user['custom:user_id'];
    const {
      eventTypeId,
      contactName,
      contactNumber,
      description,
      startTime,
      endTime,
      minGuestCount,
      maxGuestCount,
      latitude,
      longitude,
    } = req.body;

    const parsedStartTime = new Date(startTime);
    const parsedEndTime = new Date(endTime);

    if (isNaN(parsedStartTime.getTime()) || isNaN(parsedEndTime.getTime())) {
      return res.status(400).json({
        message: 'Invalid startTime or endTime',
      });
    }

    await db.insert(events).values({
      userId,
      eventTypeId,
      contactName,
      contactNumber,
      description,
      startTime: parsedStartTime,
      endTime: parsedEndTime,
      minGuestCount,
      maxGuestCount,
      latitude,
      longitude,
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
      contactName,
      contactNumber,
      description,
      startTime,
      endTime,
      minGuestCount,
      maxGuestCount,
      latitude,
      longitude,
    } = req.body;

    const parsedStartTime = new Date(startTime);
    const parsedEndTime = new Date(endTime);

    if (isNaN(parsedStartTime.getTime()) || isNaN(parsedEndTime.getTime())) {
      return res.status(400).json({
        message: 'Invalid startTime or endTime',
      });
    }

    const data = await db
      .update(events)
      .set({
        eventTypeId,
        contactName,
        contactNumber,
        description,
        startTime: parsedStartTime,
        endTime: parsedEndTime,
        minGuestCount,
        maxGuestCount,
        latitude,
        longitude,
        updatedAt: new Date(),
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
    const { eventId, productId } = req.body;
    const quantity = req.body.quantity || 1;
    // await db
    //   .insert(eventItems)
    //   .values({ eventId: eventId, productId: productId, quantity: quantity });

    const item = await createBookingDraft({
      source: SOURCE.EVENT,
      sourceId: eventId,
      productId,
      quantity,
      status: STATUS.HOLD,
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

    // const eventItem = await db
    //   .select()
    //   .from(eventItems)
    //   .where(eq(eventItems.id, itemId));

    // if (eventItem.length > 0) {
    //   const event = await db
    //     .select({ userId: events.userId })
    //     .from(events)
    //     .where(eq(events.eventId, eventItem[0].eventId));
    //   if (event[0].userId == userId) {
    //     await db.delete(eventItems).where(eq(eventItems.id, eventItem[0].id));
    //     return res.status(200).json({
    //       message: 'Event item deleted successfully.',
    //     });
    //   } else {
    //     return res.status(401).json({
    //       message: 'You are not authorized to delete event item.',
    //     });
    //   }
    // } else {
    //   return res.status(500).json({
    //     message: 'Event item not found.',
    //   });
    // }
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
