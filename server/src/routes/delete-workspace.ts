import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { StatusCode } from "@/constants/status-code"
import { prisma } from "@/lib/prisma"

export const deleteWorkspaceRoute: FastifyPluginAsyncZod = async (server) => {
  server.delete(
    "/:idOrSlug",
    {
      schema: {
        tags: ["workspace"],
        summary: "Delete a workspace by id or slug",
        description:
          "Delete a workspace by id or slug. This endpoint requires a valid session cookie or session header for authentication.",
        security: [{ cookie: [], session: [] }],
        params: z.object({
          idOrSlug: z.string().meta({
            example: "V1StGXR8_Z5jdHi6B-myT",
          }),
        }),
        response: {
          204: z.void().describe("Workspace deleted successfully!"),
          401: z.void().describe("Unauthorized - user not logged in"),
          403: z
            .void()
            .describe("Forbidden - user is not the owner of the workspace"),
          404: z.void().describe("Workspace not found!"),
        },
      },
    },
    async (request, reply) => {
      const { idOrSlug } = request.params
      const user = await request.getLoggedUser(request)
      if (!user) {
        return reply.status(StatusCode.UNAUTHORIZED).send()
      }

      const workspaceOnDb = await prisma.workspace.findFirst({
        where: {
          OR: [{ id: idOrSlug }, { slug: idOrSlug }],
        },
        select: {
          id: true,
          ownerId: true,
        },
      })

      if (!workspaceOnDb) {
        return reply.status(StatusCode.NOT_FOUND).send()
      }

      if (user.id !== workspaceOnDb.ownerId) {
        return reply.status(StatusCode.FORBIDDEN).send()
      }

      await prisma.workspace.delete({
        where: {
          id: workspaceOnDb.id,
        },
      })

      return reply.status(StatusCode.NO_CONTENT).send()
    }
  )
}
