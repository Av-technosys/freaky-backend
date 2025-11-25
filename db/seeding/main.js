import { seedVendor } from "./vendor.js";

async function main() {
    console.log("Seeding...");
    await seedVendor()
    console.log("Done seeding");
}

main()