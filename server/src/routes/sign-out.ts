import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { StatusCode } from "@/constants/status-code"
import { Session } from "@/lib/session"

export const signOutRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/sign-out",
    {
      schema: {
        tags: ["auth"],
        summary: "User logout",
        description:
          "Logs out the currently authenticated user, invalidating their session and removing access to protected resources.",
        security: [{ cookie: [], session: [] }],
        response: {
          200: z.void().describe("User logged out successfully!"),
          401: z.void().describe("User not authenticated!"),
        },
      },
    },
    async (request, reply) => {
      const { session } = await request.getSession(request)

      if (!session) {
        return reply.status(StatusCode.UNAUTHORIZED).send()
      }

      await Session.invalidateOlderSessions(session.userId)
      return reply.status(StatusCode.OK).send()
    }
  )
}
