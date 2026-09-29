// Loads server/.env (if present) into process.env for local development.
// Hosts like Render set environment variables directly, so no file is needed there.
import path from 'path';
import { fileURLToPath } from 'url';

const envFile = path.join(path.dirname(fileURLToPath(import.meta.url)), '.env');
try {
  process.loadEnvFile(envFile);
} catch {
  // No .env file — fine.
}
