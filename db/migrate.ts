import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Run migrations with retry logic
async function main() {
  const MAX_RETRIES = 5;
  const RETRY_DELAY = 5000; // 5 seconds
  
  const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/todo_db';
  let currentTry = 0;
  
  while (currentTry < MAX_RETRIES) {
    try {
      console.log(`⏳ Connecting to database (attempt ${currentTry + 1}/${MAX_RETRIES})...`);
      const migrationClient = postgres(connectionString, { max: 1 });
      
      console.log('⏳ Running migrations...');
      await migrate(drizzle(migrationClient), { migrationsFolder: "drizzle" });
      
      console.log('✅ Migrations completed successfully');
      await migrationClient.end();
      process.exit(0);
    } catch (error) {
      currentTry++;
      
      if (currentTry >= MAX_RETRIES) {
        console.error('❌ Migration failed after maximum retries:', error);
        process.exit(1);
      }
      
      console.error(`⚠️ Migration attempt ${currentTry} failed, retrying in ${RETRY_DELAY/1000} seconds...`);
      console.error(error);
      
      // Wait before retrying
      await sleep(RETRY_DELAY);
    }
  }
}

main().catch(error => {
  console.error('❌ Unhandled error in migration script:', error);
  process.exit(1);
});
