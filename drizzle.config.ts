import {defineConfig} from 'drizzle-kit';
import {config} from "dotenv"

config({path: ".env"});


export default defineConfig({
    schema: './server/schema.ts',
    out: './server/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.POSTGRES_URL!,
    },
});