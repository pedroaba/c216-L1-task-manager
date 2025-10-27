import "dotenv/config"

import { z } from "zod"
import { appConfig } from "./constants/application"

const envSchema = z.object({
  // application variables
  PORT: z.coerce.number().default(appConfig.DEFAULT_PORT),
  SECRET_KEY: z.string(),

  // database variables
  DATABASE_URL: z.string(),

  // google email variables
  GOOGLE_PASSWORD: z.string(),
  GOOGLE_EMAIL: z.email(),

  // frontend url
  BASE_FRONTEND_URL: z.url(),
})

export const env = envSchema.parse(process.env)
