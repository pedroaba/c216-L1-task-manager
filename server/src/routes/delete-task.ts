import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { StatusCode } from "@/constants/status-code"
import { prisma } from "@/lib/prisma"

export const deleteTaskRoute: FastifyPluginAsyncZod = async (server) => {
  server.delete(
    "/:id",
    {
      schema: {
        tags: ["task"],
        summary: "Delete a task by id",
        description:
          "Delete a task by id. This endpoint requires a valid session cookie or session header for authentication.",
        security: [{ cookie: [], session: [] }],
        params: z.object({
          id: z.string().meta({
            example: "V1StGXR8_Z5jdHi6B-myT",
          }),
        }),
        response: {
          204: z.void().describe("Task deleted successfully!"),
          401: z.void().describe("Unauthorized - user not logged in"),
          403: z
            .void()
            .describe(
              "Forbidden - user is not the owner or member of the project"
            ),
          404: z.void().describe("Task not found!"),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      const user = await request.getLoggedUser(request)
      if (!user) {
        return reply.status(StatusCode.UNAUTHORIZED).send()
      }

      const taskOnDb = await prisma.task.findUnique({
        where: {
          id,
        },
        include: {
          project: {
            include: {
              members: {
                select: {
                  userId: true,
                },
              },
            },
          },
        },
      })

      if (!taskOnDb) {
        return reply.status(StatusCode.NOT_FOUND).send()
      }

      // Verify if user is owner or member of the project
      const isOwner = user.id === taskOnDb.project.ownerId
      const isMember = taskOnDb.project.members.some(
        (member) => member.userId === user.id
      )

      if (!isOwner && !isMember) {
        return reply.status(StatusCode.FORBIDDEN).send()
      }

      await prisma.task.delete({
        where: {
          id,
        },
      })

      return reply.status(StatusCode.NO_CONTENT).send()
    }
  )
}

