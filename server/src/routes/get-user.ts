import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { StatusCode } from "@/constants/status-code"
import { prisma } from "@/lib/prisma"
import { auth } from "./hooks/auth"

export const getUserRoute: FastifyPluginAsyncZod = async (server) => {
  await server.get(
    "/:id",
    {
      preHandler: [auth],
      schema: {
        tags: ["users"],
        summary: "Get user profile",
        description:
          "Retrieves detailed profile information for a specific user by their unique identifier, including personal details such as name and email address.",
        security: [{ cookie: [], session: [] }],
        params: z.object({
          id: z.uuid().meta({
            example: "123e4567-e89b-12d3-a456-426614174000",
          }),
        }),
        response: {
          200: z
            .object({
              user: z.object({
                id: z.uuid().meta({
                  example: "1",
                }),
                name: z.string().meta({
                  example: "John Doe",
                }),
                email: z.email().meta({
                  example: "john.doe@example.com",
                }),
              }),
            })
            .describe("User profile!")
            .meta({
              example: {
                user: {
                  id: "123e4567-e89b-12d3-a456-426614174000",
                  name: "John Doe",
                  email: "john.doe@example.com",
                },
              },
            }),
          404: z.void().describe("User not found!"),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      const user = await prisma.user.findUnique({
        where: { id },
      })

      if (!user) {
        return reply.status(StatusCode.NOT_FOUND).send()
      }

      return reply.status(StatusCode.OK).send({ user })
    }
  )
}
