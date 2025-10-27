import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { appConfig } from "@/constants/application"
import { StatusCode } from "@/constants/status-code"
import { prisma } from "@/lib/prisma"

export const listProjectRoute: FastifyPluginAsyncZod = async (server) => {
  await server.get(
    "/",
    {
      schema: {
        tags: ["project"],
        summary: "List all projects",
        description:
          "List all projects. This endpoint requires a valid session cookie or session header for authentication.",
        security: [{ cookie: [], session: [] }],
        querystring: z.object({
          page: z.number().optional().default(1).meta({
            example: 1,
          }),
          limit: z
            .number()
            .min(1)
            .max(appConfig.FETCH.MAX_LIMIT)
            .optional()
            .default(appConfig.FETCH.DEFAULT_LIMIT)
            .meta({
              example: 100,
            }),
          q: z.string().optional().meta({
            example: "development",
            description:
              "Search query to filter projects by name or description or slug (case insensitive)",
          }),
          workspaceId: z.string().optional().meta({
            example: "V1StGXR8_Z5jdHi6B-myT",
            description: "Filter projects by workspace ID or slug",
          }),
        }),
        response: {
          200: z
            .object({
              projects: z.array(
                z.object({
                  id: z.string(),
                  name: z.string(),
                  slug: z.string(),
                  description: z.string().optional(),
                  icon: z.string().optional(),
                  background: z.string().optional(),
                  owner: z.object({
                    id: z.string(),
                    name: z.string(),
                    email: z.string(),
                  }),
                  workspace: z.object({
                    id: z.string(),
                    name: z.string(),
                    slug: z.string(),
                  }),
                  createdAt: z.date(),
                  updatedAt: z.date(),
                  totalMembers: z.number(),
                })
              ),
              total: z.number(),
              page: z.number(),
              limit: z.number(),
              hasNextPage: z.boolean(),
            })
            .describe("Projects found successfully!")
            .meta({
              example: {
                projects: [
                  {
                    id: "V1StGXR8_Z5jdHi6B-myT",
                    name: "My Project",
                    slug: "my-project",
                    description: "This is a description of the project",
                    icon: "Folder",
                    background: "#1a1a1a",
                    owner: {
                      id: "123e4567-e89b-12d3-a456-426614174000",
                      name: "John Doe",
                      email: "john.doe@example.com",
                    },
                    workspace: {
                      id: "V1StGXR8_Z5jdHi6B-myT",
                      name: "My Workspace",
                      slug: "my-workspace",
                    },
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    totalMembers: 3,
                  },
                ],
                total: 1,
                page: 1,
                limit: 100,
                hasNextPage: false,
              },
            }),
          401: z.void().describe("Unauthorized - user not logged in"),
        },
      },
    },
    async (request, reply) => {
      const { page, limit, q = "", workspaceId } = request.query

      const user = await request.getLoggedUser(request)
      if (!user) {
        return reply.status(StatusCode.UNAUTHORIZED).send()
      }

      const whereClause: {
        OR: Array<{
          name?: { contains: string; mode: "insensitive" }
          description?: { contains: string; mode: "insensitive" }
          slug?: { contains: string; mode: "insensitive" }
        }>
        workspaceId?: string
      } = {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { slug: { contains: q, mode: "insensitive" } },
        ],
      }

      // If workspaceId is provided, filter by workspace
      if (workspaceId) {
        const workspace = await prisma.workspace.findFirst({
          where: {
            OR: [{ id: workspaceId }, { slug: workspaceId }],
          },
          select: { id: true },
        })

        if (workspace) {
          whereClause.workspaceId = workspace.id
        }
      }

      const projectsOnDb = await prisma.project.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: whereClause,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          workspace: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          _count: {
            select: {
              members: true,
            },
          },
        },
      })

      const total = await prisma.project.count({
        where: whereClause,
      })

      const projects = projectsOnDb.map(
        (project: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          background: string | null
          createdAt: Date
          updatedAt: Date
          owner: { id: string; name: string; email: string }
          workspace: { id: string; name: string; slug: string }
          _count: { members: number }
        }) => ({
          id: project.id,
          name: project.name,
          slug: project.slug,
          description: project.description ?? undefined,
          icon: project.icon ?? undefined,
          background: project.background ?? undefined,
          owner: project.owner,
          workspace: project.workspace,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
          totalMembers: project._count.members,
        })
      )

      return reply.status(StatusCode.OK).send({
        projects,
        total,
        page,
        limit,
        hasNextPage: page * limit < total,
      })
    }
  )
}
