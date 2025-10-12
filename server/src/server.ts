import { app } from "./app"
import { env } from "./env"
import { logger } from "./lib/logger"

app.listen({ port: env.PORT, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    logger.error(err)
    process.exit(1)
  }

  logger.debug(`🚀 Server is running on ${address}`)
})
