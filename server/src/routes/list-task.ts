import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { appConfig } from "@/constants/application"
import { StatusCode } from "@/constants/status-code"
import { prisma } from "@/lib/prisma"

export const listTaskRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/",
    {
      schema: {
        tags: ["task"],
        summary: "List all tasks",
        description:
          "List all tasks. This endpoint requires a valid session cookie or session header for authentication.",
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
            example: "authentication",
            description:
              "Search query to filter tasks by title or description (case insensitive)",
          }),
          projectId: z.string().optional().meta({
            example: "V1StGXR8_Z5jdHi6B-myT",
            description: "Filter tasks by project ID or slug",
          }),
          status: z
            .enum(["todo", "in-progress", "in-review", "done"])
            .optional()
            .meta({
              example: "todo",
              description: "Filter tasks by status",
            }),
          priority: z.enum(["low", "medium", "high"]).optional().meta({
            example: "high",
            description: "Filter tasks by priority",
          }),
          assigneeId: z.string().optional().meta({
            example: "123e4567-e89b-12d3-a456-426614174000",
            description: "Filter tasks by assignee ID",
          }),
        }),
        response: {
          200: z
            .object({
              tasks: z.array(
                z.object({
                  id: z.string(),
                  title: z.string(),
                  description: z.string().optional(),
                  status: z.string(),
                  priority: z.string(),
                  labels: z.array(z.string()),
                  dueDate: z.date().optional(),
                  assignee: z
                    .object({
                      id: z.string(),
                      name: z.string(),
                      email: z.string(),
                    })
                    .optional(),
                  project: z.object({
                    id: z.string(),
                    name: z.string(),
                    slug: z.string(),
                  }),
                  createdAt: z.date(),
                  updatedAt: z.date(),
                })
              ),
              total: z.number(),
              page: z.number(),
              limit: z.number(),
              hasNextPage: z.boolean(),
            })
            .describe("Tasks found successfully!")
            .meta({
              example: {
                tasks: [
                  {
                    id: "V1StGXR8_Z5jdHi6B-myT",
                    title: "Implement user authentication",
                    description: "This is a description of the task",
                    status: "todo",
                    priority: "medium",
                    labels: ["frontend", "bug"],
                    dueDate: new Date("2024-12-31T23:59:59Z"),
                    assignee: {
                      id: "123e4567-e89b-12d3-a456-426614174000",
                      name: "John Doe",
                      email: "john.doe@example.com",
                    },
                    project: {
                      id: "V1StGXR8_Z5jdHi6B-myT",
                      name: "My Project",
                      slug: "my-project",
                    },
                    createdAt: new Date(),
                    updatedAt: new Date(),
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
      const {
        page,
        limit,
        q = "",
        projectId,
        status,
        priority,
        assigneeId,
      } = request.query

      const user = await request.getLoggedUser(request)
      if (!user) {
        return reply.status(StatusCode.UNAUTHORIZED).send()
      }

      const whereClause: {
        OR?: Array<{
          title?: { contains: string; mode: "insensitive" }
          description?: { contains: string; mode: "insensitive" }
        }>
        projectId?: string
        status?: string
        priority?: string
        assigneeId?: string | null
      } = {}

      // Search query
      if (q) {
        whereClause.OR = [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ]
      }

      // Filter by project
      if (projectId) {
        const project = await prisma.project.findFirst({
          where: {
            OR: [{ id: projectId }, { slug: projectId }],
          },
          select: { id: true },
        })

        if (project) {
          whereClause.projectId = project.id
        }
      }

      // Filter by status
      if (status) {
        whereClause.status = status
      }

      // Filter by priority
      if (priority) {
        whereClause.priority = priority
      }

      // Filter by assignee
      if (assigneeId) {
        whereClause.assigneeId = assigneeId
      }

      const tasksOnDb = await prisma.task.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: whereClause,
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          project: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      const total = await prisma.task.count({
        where: whereClause,
      })

      const tasks = tasksOnDb.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description ?? undefined,
        status: task.status,
        priority: task.priority,
        labels: task.labels,
        dueDate: task.dueDate ?? undefined,
        assignee: task.assignee
          ? {
              id: task.assignee.id,
              name: task.assignee.name,
              email: task.assignee.email,
            }
          : undefined,
        project: task.project,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      }))

      return reply.status(StatusCode.OK).send({
        tasks,
        total,
        page,
        limit,
        hasNextPage: page * limit < total,
      })
    }
  )
}

