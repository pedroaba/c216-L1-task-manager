import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { StatusCode } from "@/constants/status-code"
import { MIN_NAME_LENGTH } from "@/constants/validation"
import { prisma } from "@/lib/prisma"
import { slugify } from "@/utils/slugify"

export const createWorkspaceRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/",
    {
      schema: {
        tags: ["workspace"],
        summary: "Create a workspace",
        description:
          "Creates a new workspace for the authenticated user. This endpoint requires a valid session cookie or session header for authentication.",
        security: [{ cookie: [], session: [] }],
        body: z.object({
          name: z
            .string()
            .min(MIN_NAME_LENGTH, "Nome precisa ter 5 caracteres")
            .meta({
              example: "John Doe",
            }),
          description: z.string().optional().meta({
            example: "This is a description of the workspace",
          }),
        }),
        response: {
          201: z
            .object({ workspaceId: z.string() })
            .describe("Workspace created successfully!")
            .meta({
              example: {
                workspaceId: "V1StGXR8_Z5jdHi6B-myT",
              },
            }),
          401: z.void().describe("Unauthorized - user not logged in"),
          409: z.void().describe("Workspace already exists!"),
        },
      },
    },
    async (request, reply) => {
      const { name, description } = request.body

      const user = await request.getLoggedUser(request)
      if (!user) {
        return reply.status(StatusCode.UNAUTHORIZED).send()
      }

      const workspaceSlug = slugify(name)
      const workspaceOnDb = await prisma.workspace.findUnique({
        where: {
          slug: workspaceSlug,
        },
      })

      if (workspaceOnDb) {
        return reply.status(StatusCode.CONFLICT).send()
      }

      const workspace = await prisma.workspace.create({
        data: {
          name,
          slug: workspaceSlug,
          description,
          ownerId: user.id,
        },
      })

      return reply
        .status(StatusCode.CREATED)
        .send({ workspaceId: workspace.id })
    }
  )
}
