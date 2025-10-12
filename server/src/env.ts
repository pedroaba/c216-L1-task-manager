import "dotenv/config"

import { z } from "zod"
import { appConfig } from "./constants/application"

const envSchema = z.object({
  PORT: z.coerce.number().default(appConfig.DEFAULT_PORT),
  SECRET_KEY: z.string(),
  DATABASE_URL: z.string(),
})

export const env = envSchema.parse(process.env)
