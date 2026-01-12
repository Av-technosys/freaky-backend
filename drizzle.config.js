// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';
import { DATABASE_URL } from './const/env.js';

export default defineConfig({
  dialect: 'postgresql',
  schema: './db/schema.js',
  out: './db/migrations',
  dbCredentials: {
    url: DATABASE_URL,
  },
  tablesFilter: [
    'public.*',
    '!spatial_ref_sys',
    '!geography_columns',
    '!geometry_columns',
  ],
});
