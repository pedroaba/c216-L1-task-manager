import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { StatusCode } from "@/constants/status-code"
import { prisma } from "@/lib/prisma"

export const getTaskByIdRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/:id",
    {
      schema: {
        tags: ["task"],
        summary: "Get a task by id",
        description:
          "Get a task by id. This endpoint requires a valid session cookie or session header for authentication.",
        security: [{ cookie: [], session: [] }],
        params: z.object({
          id: z.string().meta({
            example: "V1StGXR8_Z5jdHi6B-myT",
          }),
        }),
        response: {
          200: z
            .object({
              task: z.object({
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
              }),
            })
            .describe("Task found successfully!")
            .meta({
              example: {
                task: {
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
              },
            }),
          401: z.void().describe("Unauthorized - user not logged in"),
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
      })

      if (!taskOnDb) {
        return reply.status(StatusCode.NOT_FOUND).send()
      }

      return reply.status(StatusCode.OK).send({
        task: {
          id: taskOnDb.id,
          title: taskOnDb.title,
          description: taskOnDb.description ?? undefined,
          status: taskOnDb.status,
          priority: taskOnDb.priority,
          labels: taskOnDb.labels,
          dueDate: taskOnDb.dueDate ?? undefined,
          assignee: taskOnDb.assignee
            ? {
                id: taskOnDb.assignee.id,
                name: taskOnDb.assignee.name,
                email: taskOnDb.assignee.email,
              }
            : undefined,
          project: taskOnDb.project,
          createdAt: taskOnDb.createdAt,
          updatedAt: taskOnDb.updatedAt,
        },
      })
    }
  )
}

