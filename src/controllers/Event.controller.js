import { asc, eq } from 'drizzle-orm';
import { db } from '../../db/db.js';
import {
  eventItems,
  eventProductType,
  events,
  eventType,
  productTypes,
} from '../../db/schema.js';

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
      eventDate: new Date(eventDate),
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
    await db
      .insert(eventItems)
      .values({ eventId: eventId, productId: productId, quantity: quantity });

    return res.status(201).json({
      message: 'Event item created successfully...',
    });
  } catch (error) {
    console.error('Error: ', error);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteEventItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user['custom:user_id'];

    const eventItem = await db
      .select()
      .from(eventItems)
      .where(eq(eventItems.id, itemId));

    if (eventItem.length > 0) {
      const event = await db
        .select({ userId: events.userId })
        .from(events)
        .where(eq(events.eventId, eventItem[0].eventId));
      if (event[0].userId == userId) {
        await db.delete(eventItems).where(eq(eventItems.id, eventItem[0].id));
        return res.status(200).json({
          message: 'Event item deleted successfully...',
        });
      } else {
        return res.status(401).json({
          message: 'You are not authorized to delete event item..',
        });
      }
    } else {
      return res.status(500).json({
        message: 'Event item not found...',
      });
    }
  } catch (error) {
    console.error('Error: ', error);
    return res.status(500).json({ message: error.message });
  }
};
