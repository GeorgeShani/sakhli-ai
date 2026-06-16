import pg from "pg";

const regions = [
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "us-west-2",
  "ca-central-1",
  "eu-west-1",
  "eu-west-2",
  "eu-west-3",
  "eu-central-1",
  "eu-central-2",
  "eu-north-1",
  "ap-south-1",
  "ap-southeast-1",
  "ap-southeast-2",
  "ap-northeast-1",
  "ap-northeast-2",
  "sa-east-1",
];

async function checkRegion(region) {
  const host = `aws-0-${region}.pooler.supabase.com`;
  // Using port 5432 which is much more commonly allowed outbound by local firewalls
  const connectionString = `postgresql://postgres.xznfrlutpjaavswtbaci:GaniviChemiTkivilia@${host}:5432/postgres`;

  const client = new pg.Client({
    connectionString,
    connectionTimeoutMillis: 3000,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    await client.end();
    return { region, success: true };
  } catch (err) {
    const msg = err.message || "";
    if (msg.includes("not found") && msg.includes("tenant")) {
      return { region, success: false, notFound: true };
    }
    // Any other error (like authorization or timeout) might indicate the host responded to our tenant, meaning it's the correct region!
    return { region, success: true, err: msg };
  }
}

async function run() {
  console.log("🔍 Probing Supabase regions for tenant 'xznfrlutpjaavswtbaci' on port 5432...");
  const promises = regions.map((r) => checkRegion(r));
  const results = await Promise.all(promises);

  const matched = results.filter((r) => r.success);
  if (matched.length > 0) {
    console.log("\n🎯 MATCHED REGION(S):");
    matched.forEach((m) => {
      console.log(`- ${m.region} (Response: ${m.err || "Success!"})`);
    });
  } else {
    console.log("\n❌ No regions matched. Please double check project-ref and password.");
  }
}

run();
