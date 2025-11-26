import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { StatusCode } from "@/constants/status-code"
import { MIN_NAME_LENGTH } from "@/constants/validation"
import { prisma } from "@/lib/prisma"

export const createTaskRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/",
    {
      schema: {
        tags: ["task"],
        summary: "Create a task",
        description:
          "Creates a new task for the authenticated user within a project. This endpoint requires a valid session cookie or session header for authentication.",
        security: [{ cookie: [], session: [] }],
        body: z.object({
          title: z
            .string()
            .min(MIN_NAME_LENGTH, "Título precisa ter 5 caracteres")
            .meta({
              example: "Implement user authentication",
            }),
          description: z.string().optional().default("").meta({
            example: "This is a description of the task",
          }),
          projectId: z.string().meta({
            example: "V1StGXR8_Z5jdHi6B-myT",
          }),
          assigneeId: z.string().optional().meta({
            example: "123e4567-e89b-12d3-a456-426614174000",
          }),
          status: z
            .enum(["todo", "in-progress", "in-review", "done"])
            .optional()
            .default("todo")
            .meta({
              example: "todo",
            }),
          priority: z
            .enum(["low", "medium", "high"])
            .optional()
            .default("medium")
            .meta({
              example: "medium",
            }),
          labels: z.array(z.string()).optional().default([]).meta({
            example: ["frontend", "bug"],
          }),
          dueDate: z
            .string()
            .datetime()
            .optional()
            .meta({
              example: "2024-12-31T23:59:59Z",
            }),
        }),
        response: {
          201: z
            .object({ taskId: z.string() })
            .describe("Task created successfully!")
            .meta({
              example: {
                taskId: "V1StGXR8_Z5jdHi6B-myT",
              },
            }),
          401: z.void().describe("Unauthorized - user not logged in"),
          403: z
            .void()
            .describe(
              "Forbidden - user is not the owner or member of the project"
            ),
          404: z.void().describe("Project not found!"),
        },
      },
    },
    async (request, reply) => {
      const {
        title,
        description,
        projectId,
        assigneeId,
        status,
        priority,
        labels,
        dueDate,
      } = request.body

      const user = await request.getLoggedUser(request)
      if (!user) {
        return reply.status(StatusCode.UNAUTHORIZED).send()
      }

      // Verify if project exists
      const projectOnDb = await prisma.project.findFirst({
        where: {
          OR: [{ id: projectId }, { slug: projectId }],
        },
        include: {
          members: {
            select: {
              userId: true,
            },
          },
        },
      })

      if (!projectOnDb) {
        return reply.status(StatusCode.NOT_FOUND).send()
      }

      // Verify if user is owner or member of the project
      const isOwner = user.id === projectOnDb.ownerId
      const isMember = projectOnDb.members.some(
        (member) => member.userId === user.id
      )

      if (!isOwner && !isMember) {
        return reply.status(StatusCode.FORBIDDEN).send()
      }

      // If assigneeId is provided, verify if assignee exists
      if (assigneeId) {
        const assignee = await prisma.user.findUnique({
          where: { id: assigneeId },
        })

        if (!assignee) {
          return reply.status(StatusCode.NOT_FOUND).send()
        }
      }

      const task = await prisma.task.create({
        data: {
          title,
          description,
          projectId: projectOnDb.id,
          assigneeId,
          status: status ?? "todo",
          priority: priority ?? "medium",
          labels: labels ?? [],
          dueDate: dueDate ? new Date(dueDate) : null,
        },
      })

      return reply.status(StatusCode.CREATED).send({ taskId: task.id })
    }
  )
}

