import { randomBytes } from "node:crypto"
import { prisma } from "./prisma"

const TOKEN_LENGTH = 32

export const Session = {
  token() {
    const prefix =
      process.env.NODE_ENV === "production" ? "task-management" : "dev"
    const token = randomBytes(TOKEN_LENGTH)

    return `${prefix}:${token.toString("hex")}`
  },

  async invalidateOlderSessions(userId: string) {
    try {
      await prisma.session.updateMany({
        where: {
          userId,
          invalidatedAt: null,
        },
        data: {
          invalidatedAt: new Date(),
        },
      })
    } finally {
      // do nothing
    }
  },

  async invalidateSession(sessionId: string) {
    await prisma.session.update({
      where: { id: sessionId },
      data: {
        invalidatedAt: new Date(),
      },
    })
  },
}
