import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { StatusCode } from "@/constants/status-code"
import { MIN_NAME_LENGTH } from "@/constants/validation"
import { prisma } from "@/lib/prisma"
import { slugify } from "@/utils/slugify"

export const createProjectRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/",
    {
      schema: {
        tags: ["project"],
        summary: "Create a project",
        description:
          "Creates a new project for the authenticated user within a workspace. This endpoint requires a valid session cookie or session header for authentication.",
        security: [{ cookie: [], session: [] }],
        body: z.object({
          name: z
            .string()
            .min(MIN_NAME_LENGTH, "Nome precisa ter 5 caracteres")
            .meta({
              example: "My Project",
            }),
          description: z.string().optional().meta({
            example: "This is a description of the project",
          }),
          workspaceId: z.string().meta({
            example: "V1StGXR8_Z5jdHi6B-myT",
          }),
          icon: z.string().optional().default("Folder").meta({
            example: "Folder",
          }),
          background: z.string().optional().default("#1a1a1a").meta({
            example: "#1a1a1a",
          }),
        }),
        response: {
          201: z
            .object({ projectId: z.string() })
            .describe("Project created successfully!")
            .meta({
              example: {
                projectId: "V1StGXR8_Z5jdHi6B-myT",
              },
            }),
          401: z.void().describe("Unauthorized - user not logged in"),
          403: z
            .void()
            .describe("Forbidden - user is not the owner of the workspace"),
          404: z.void().describe("Workspace not found!"),
          409: z.void().describe("Project already exists!"),
        },
      },
    },
    async (request, reply) => {
      const { name, description, workspaceId, icon, background } = request.body

      const user = await request.getLoggedUser(request)
      if (!user) {
        return reply.status(StatusCode.UNAUTHORIZED).send()
      }

      // Verify if workspace exists and user is the owner
      const workspaceOnDb = await prisma.workspace.findFirst({
        where: {
          OR: [{ id: workspaceId }, { slug: workspaceId }],
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

      const projectSlug = slugify(name)
      const projectOnDb = await prisma.project.findUnique({
        where: {
          slug: projectSlug,
        },
      })

      if (projectOnDb) {
        return reply.status(StatusCode.CONFLICT).send()
      }

      const project = await prisma.project.create({
        data: {
          name,
          slug: projectSlug,
          description,
          icon,
          background,
          ownerId: user.id,
          workspaceId: workspaceOnDb.id,
        },
      })

      return reply.status(StatusCode.CREATED).send({ projectId: project.id })
    }
  )
}
