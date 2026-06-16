import fs from "node:fs";
import path from "node:path";
import pg from "pg";

const connectionString =
  "postgresql://postgres:GaniviChemiTkivilia@db.xznfrlutpjaavswtbaci.supabase.co:5432/postgres";

async function run() {
  console.log("🔌 Connecting to Supabase PostgreSQL Database...");
  const client = new pg.Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await client.connect();
    console.log("✅ Connected successfully!");

    // 1) Read and apply consolidated schema
    const schemaPath = path.resolve("supabase/migrations/20260614000000_consolidated_schema.sql");
    console.log(`\n📄 Reading consolidated schema from: ${schemaPath}`);
    const schemaSql = fs.readFileSync(schemaPath, "utf-8");

    console.log("⚡ Applying schema (tables, views, indexes, triggers)...");
    await client.query(schemaSql);
    console.log("✅ Schema applied successfully!");

    // 2) Read and apply seed data
    const seedPath = path.resolve("supabase/migrations/20260614000001_seed.sql");
    console.log(`\n📄 Reading seed data from: ${seedPath}`);
    const seedSql = fs.readFileSync(seedPath, "utf-8");

    console.log("⚡ Inserting seed data (users, properties, profiles, bookings)...");
    await client.query(seedSql);
    console.log("✅ Seed data inserted successfully!");

    console.log("\n🎉 Database migration and seeding fully completed!");
  } catch (err) {
    console.error("\n❌ Error running database migration/seeding:", err);
  } finally {
    await client.end();
    console.log("🔌 Connection closed.");
  }
}

run();
