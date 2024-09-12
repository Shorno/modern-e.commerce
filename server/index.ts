import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { config } from "dotenv";

config({ path: ".env" });



const sql = neon(process.env.POSTGRES_URL!);
export const db = drizzle(sql);

