import pg from 'pg';

const connectionString = "postgresql://postgres.xznfrlutpjaavswtbaci:GaniviChemiTkivilia@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres";

async function run() {
  console.log("🔌 Attempting to connect to Sydney pooler (aws-0-ap-southeast-2)...");
  console.log("💡 (Note: If your free database was paused, this will trigger a resume which can take up to 20-30 seconds to wake up!)");

  const client = new pg.Client({
    connectionString,
    connectionTimeoutMillis: 30000, // 30 seconds
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("🎯 SUCCESS! Connected successfully to the Supabase database in Sydney region!");
    await client.end();
  } catch (err) {
    console.error("❌ Connection failed:", err.message || err);
  }
}

run();
