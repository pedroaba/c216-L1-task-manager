import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { appConfig } from "@/constants/application"
import { StatusCode } from "@/constants/status-code"
import { prisma } from "@/lib/prisma"

export const listWorkspaceRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/",
    {
      schema: {
        tags: ["workspace"],
        summary: "List all workspaces",
        description:
          "List all workspaces. This endpoint requires a valid session cookie or session header for authentication.",
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
              "Search query to filter workspaces by name or description or slug (case insensitive)",
          }),
        }),
        response: {
          200: z
            .object({
              workspaces: z.array(
                z.object({
                  id: z.string(),
                  name: z.string(),
                  slug: z.string(),
                  description: z.string().optional(),
                  owner: z.object({
                    id: z.string(),
                    name: z.string(),
                    email: z.string(),
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
            .describe("Workspaces listed successfully!")
            .meta({
              example: {
                workspaces: [
                  {
                    id: "V1StGXR8_Z5jdHi6B-myT",
                    name: "Development Team",
                    slug: "development-team",
                    description: "Main development workspace for our projects",
                    owner: {
                      id: "123e4567-e89b-12d3-a456-426614174000",
                      name: "John Doe",
                      email: "john.doe@example.com",
                    },
                    createdAt: new Date("2024-01-15T10:30:00Z"),
                    updatedAt: new Date("2024-01-20T14:45:00Z"),
                    totalMembers: 5,
                  },
                  {
                    id: "A2BtHYS9_X6keIj7C-nzU",
                    name: "Marketing Team",
                    slug: "marketing-team",
                    description: "Marketing campaigns and content creation",
                    owner: {
                      id: "456e7890-e12b-34c5-d678-901234567890",
                      name: "Jane Smith",
                      email: "jane.smith@example.com",
                    },
                    createdAt: new Date("2024-01-10T08:15:00Z"),
                    updatedAt: new Date("2024-01-18T16:20:00Z"),
                    totalMembers: 3,
                  },
                ],
                total: 25,
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
      const { page, limit, q = "" } = request.query

      const workspacesOnDb = await prisma.workspace.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
          ],
        },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              members: true,
            },
          },
        },
      })

      const total = await prisma.workspace.count({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
          ],
        },
      })

      const workspaces = workspacesOnDb.map(
        (workspace: {
          id: string
          name: string
          slug: string
          description: string | null
          owner: {
            id: string
            name: string
            email: string
          }
          createdAt: Date
          updatedAt: Date
          _count: {
            members: number
          }
        }) => ({
          id: workspace.id,
          name: workspace.name,
          slug: workspace.slug,
          description: workspace.description ?? undefined,
          owner: workspace.owner,
          createdAt: workspace.createdAt,
          updatedAt: workspace.updatedAt,
          totalMembers: workspace._count.members,
        })
      )

      return reply.status(StatusCode.OK).send({
        workspaces,
        total,
        page,
        limit,
        hasNextPage: page * limit < total,
      })
    }
  )
}
