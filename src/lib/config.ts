import { z } from 'zod';
const envSchema = z.object({
 DATABASE_URL:z.string().min(1), PUBLIC_BASE_URL:z.string().url(),
 AP_MAC:z.string().regex(/^[0-9a-fA-F]{12}$/),
 AP_SHARED_SECRET:z.string().min(16), AP_ALLOWED_HOST:z.string().min(1),
 MP_ACCESS_TOKEN:z.string().min(1), MP_WEBHOOK_SECRET:z.string().min(1),
 MP_COLLECTOR_ID:z.string().optional(),
});
export function config() { return envSchema.parse(process.env); }
