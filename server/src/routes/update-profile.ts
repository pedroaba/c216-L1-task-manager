import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { StatusCode } from "@/constants/status-code"
import { logger } from "@/lib/logger"
import { prisma } from "@/lib/prisma"
import { auth } from "./hooks/auth"

export const updateProfileRoute: FastifyPluginAsyncZod = async (server) => {
  await server.put(
    "/:id",
    {
      preHandler: [auth],
      schema: {
        tags: ["users"],
        summary: "Update user profile",
        description:
          "Updates profile information for a specific user by their unique identifier. Allows modification of personal details such as name and email address. This endpoint requires a valid session cookie or session header for authentication.",
        security: [{ cookie: [], session: [] }],
        params: z.object({
          id: z.uuid().meta({
            example: "123e4567-e89b-12d3-a456-426614174000",
          }),
        }),
        body: z.object({
          name: z.string().meta({
            example: "John Doe",
          }),
          email: z.email().meta({
            example: "john.doe@example.com",
          }),
        }),
        response: {
          200: z.void().describe("User profile updated successfully!"),
          404: z.void().describe("User not found!"),
          401: z.void().describe("Unauthorized - user not logged in"),
          403: z
            .void()
            .describe("Forbidden - user not authorized to update profile"),
          409: z.void().describe("Email already in use!"),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const loggedUser = await request.getLoggedUser(request)

      console.log({ loggedUser }, "Logged user")
      if (!loggedUser) {
        return reply.status(StatusCode.UNAUTHORIZED).send()
      }

      if (loggedUser.id !== id) {
        return reply.status(StatusCode.FORBIDDEN).send()
      }

      const user = await prisma.user.findUnique({
        where: { id },
      })

      if (!user) {
        return reply.status(StatusCode.NOT_FOUND).send()
      }

      if (user.email !== request.body.email) {
        const userOnDb = await prisma.user.findUnique({
          where: { email: request.body.email },
        })

        if (userOnDb) {
          return reply.status(StatusCode.CONFLICT).send()
        }
      }

      await prisma.user.update({
        where: { id },
        data: {
          name: request.body.name,
          email: request.body.email,
        },
      })

      return reply.status(StatusCode.OK).send()
    }
  )
}
