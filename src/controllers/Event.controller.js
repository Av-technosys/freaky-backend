import { asc, eq } from 'drizzle-orm';
import { db } from '../../db/db.js';
import {
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

    await db
      .insert(events)
      .values({
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
      })
      .returning();

    return res.status(200).json({
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
      message: 'Event Types Fetched Successfully...',
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
