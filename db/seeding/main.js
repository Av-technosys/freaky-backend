// import { db } from "../db.js";
// import { seedEventTypes, seedFeaturedEventTypes } from "./event.js";
import { seedUsers } from "./user.js";
import { seedPriceBooking, seedpriceBookingEntry, seedproductMedia, seedProducts, seedproductType, seedVendor, seedVendorDocument, seedvendorMedia, seedVendorOwnership } from "./vendor.js";
// import { seedPriceBooking, seedpriceBookingEntry, seedproductMedia, seedProducts, seedVendor, seedvendorContacts, seedVendorDocument, seedvendorMedia, seedVendorOwnership } from "./vendor.js";
// import { sql } from "drizzle-orm";

async function main() {
  console.log("Seeding...");
  await seedpriceBookingEntry()
  // await seedVendor()
  // await seedEventTypes()
  // await seedFeaturedEventTypes()


  // await seedVendorOwnership()
  // await seedVendorDocument()
  // await seedvendorMedia()
  // await seedvendorContacts()
  // await seedPriceBooking()
  // await seedProducts()
  // await seedpriceBookingEntry()
  // await seedproductMedia()


  //     await db.execute(sql`
  //   INSERT INTO test_address_vendor (radius_miles, location)
  //   VALUES (
  //     ${15},
  //     ST_SetSRID(ST_MakePoint(75.860127, 26.807665), 4326)::geography
  //   );
  // `);

  //     console.log("vnedor update done ")

  //     await db.execute(sql`
  //   INSERT INTO test_address_user (street, city, state, postal_code, location)
  //   VALUES (
  //     ${"very far"},
  //     ${"jaipur"},
  //     ${"rajasthan"},
  //     ${"302017"},
  //     ST_SetSRID(ST_MakePoint(75.383955, 27.107057), 4326)::geography
  //   );
  // `);



  // const radiusMeters = 15 * 1609.34;
  // // const lat = "26.809328"
  // const lat = "26.840873"
  // // const lng = "75.864239"
  // const lng = "75.802496"

  //     const vendors = await db.execute(sql`
  //   SELECT 
  //     v.*,
  //     ST_Distance(
  //       v.location,
  //       ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography
  //     ) AS distance
  //   FROM test_address_vendor v
  //   WHERE ST_DWithin(
  //     v.location,
  //     ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
  //     ${radiusMeters}
  //   )
  //   ORDER BY distance ASC;
  // `);


  //     const vendors = await db.execute(sql`
  //   SELECT 
  //     v.*,
  //     ST_Distance(
  //       v.location,
  //       ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography
  //     ) AS distance
  //   FROM test_address_vendor v
  //   WHERE ST_DWithin(
  //     v.location,
  //     ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
  //     v.radius_miles * 1609.34
  //   )
  //   ORDER BY distance ASC;
  // `);




  //     console.log("vendors: ", vendors)

  console.log("Done seeding");
}

main()