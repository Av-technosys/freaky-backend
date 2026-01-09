const EXPIRY_MINUTES_MAP = {
  CART: 10,
  EVENT: 25,
  EXTERNAL: 30,
};

export function getBookingExpiryTime(source) {
  const minutes = EXPIRY_MINUTES_MAP[source];

  if (!minutes) {
    throw new Error(`Unknown booking source: ${source}`);
  }

  return new Date(Date.now() + minutes * 60 * 1000);
}
