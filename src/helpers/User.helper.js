import { db } from '../../db/db.js';
import { users } from '../../db/schema.js';

export function removePassowrd(data) {
  if (data) {
    const { password, ...rest } = data;
    return rest;
  }
  return data;
}

removePassowrd;

export function insertUser(data) {
  return db.insert(users).values(data).returning();
}
