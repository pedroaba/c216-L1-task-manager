import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { StatusCode } from "@/constants/status-code"
import { MIN_NAME_LENGTH } from "@/constants/validation"
import { prisma } from "@/lib/prisma"

export const updateTaskRoute: FastifyPluginAsyncZod = async (server) => {
  server.put(
    "/:id",
    {
      schema: {
        tags: ["task"],
        summary: "Update a task by id",
        description:
          "Update a task by id. This endpoint requires a valid session cookie or session header for authentication.",
        security: [{ cookie: [], session: [] }],
        params: z.object({
          id: z.string().meta({
            example: "V1StGXR8_Z5jdHi6B-myT",
          }),
        }),
        body: z.object({
          title: z
            .string()
            .min(MIN_NAME_LENGTH, "Título precisa ter 5 caracteres")
            .optional()
            .meta({
              example: "Updated Task Title",
            }),
          description: z.string().optional().meta({
            example: "Updated description of the task",
          }),
          status: z
            .enum(["todo", "in-progress", "in-review", "done"])
            .optional()
            .meta({
              example: "in-progress",
            }),
          priority: z.enum(["low", "medium", "high"]).optional().meta({
            example: "high",
          }),
          assigneeId: z.string().nullable().optional().meta({
            example: "123e4567-e89b-12d3-a456-426614174000",
          }),
          labels: z.array(z.string()).optional().meta({
            example: ["frontend", "bug", "urgent"],
          }),
          dueDate: z.string().datetime().nullable().optional().meta({
            example: "2024-12-31T23:59:59Z",
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
            .describe("Task updated successfully!")
            .meta({
              example: {
                task: {
                  id: "V1StGXR8_Z5jdHi6B-myT",
                  title: "Updated Task Title",
                  description: "Updated description of the task",
                  status: "in-progress",
                  priority: "high",
                  labels: ["frontend", "bug", "urgent"],
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
      const {
        title,
        description,
        status,
        priority,
        assigneeId,
        labels,
        dueDate,
      } = request.body

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

      // If assigneeId is provided, verify if assignee exists
      if (assigneeId !== undefined && assigneeId !== null) {
        const assignee = await prisma.user.findUnique({
          where: { id: assigneeId },
        })

        if (!assignee) {
          return reply.status(StatusCode.NOT_FOUND).send()
        }
      }

      const updateData: {
        title?: string
        description?: string
        status?: string
        priority?: string
        assigneeId?: string | null
        labels?: string[]
        dueDate?: Date | null
      } = {}

      if (title !== undefined) {
        updateData.title = title
      }

      if (description !== undefined) {
        updateData.description = description
      }

      if (status !== undefined) {
        updateData.status = status
      }

      if (priority !== undefined) {
        updateData.priority = priority
      }

      if (assigneeId !== undefined) {
        updateData.assigneeId = assigneeId
      }

      if (labels !== undefined) {
        updateData.labels = labels
      }

      if (dueDate !== undefined) {
        updateData.dueDate = dueDate ? new Date(dueDate) : null
      }

      const updatedTask = await prisma.task.update({
        where: {
          id,
        },
        data: updateData,
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

      return reply.status(StatusCode.OK).send({
        task: {
          id: updatedTask.id,
          title: updatedTask.title,
          description: updatedTask.description ?? undefined,
          status: updatedTask.status,
          priority: updatedTask.priority,
          labels: updatedTask.labels,
          dueDate: updatedTask.dueDate ?? undefined,
          assignee: updatedTask.assignee
            ? {
                id: updatedTask.assignee.id,
                name: updatedTask.assignee.name,
                email: updatedTask.assignee.email,
              }
            : undefined,
          project: updatedTask.project,
          createdAt: updatedTask.createdAt,
          updatedAt: updatedTask.updatedAt,
        },
      })
    }
  )
}

