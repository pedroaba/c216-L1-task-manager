import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { StatusCode } from "@/constants/status-code"
import { prisma } from "@/lib/prisma"

export const getProjectByIdOrSlugRoute: FastifyPluginAsyncZod = async (
  server
) => {
  server.get(
    "/:idOrSlug",
    {
      schema: {
        tags: ["project"],
        summary: "Get a project by id or slug",
        description:
          "Get a project by id or slug. This endpoint requires a valid session cookie or session header for authentication.",
        security: [{ cookie: [], session: [] }],
        params: z.object({
          idOrSlug: z.string().meta({
            example: "V1StGXR8_Z5jdHi6B-myT",
          }),
        }),
        response: {
          200: z
            .object({
              project: z.object({
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
                members: z.array(
                  z.object({
                    id: z.string(),
                    name: z.string(),
                    email: z.string(),
                    createdAt: z.date(),
                  })
                ),
              }),
            })
            .describe("Project found successfully!")
            .meta({
              example: {
                project: {
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
                  members: [
                    {
                      id: "123e4567-e89b-12d3-a456-426614174000",
                      name: "John Doe",
                      email: "john.doe@example.com",
                      createdAt: new Date(),
                    },
                    {
                      id: "123e4567-e89b-12d3-a456-426614174000",
                      name: "Jane Doe",
                      email: "jane.doe@example.com",
                      createdAt: new Date(),
                    },
                  ],
                },
              },
            }),
          401: z.void().describe("Unauthorized - user not logged in"),
          404: z.void().describe("Project not found!"),
        },
      },
    },
    async (request, reply) => {
      const { idOrSlug } = request.params

      const projectOnDb = await prisma.project.findFirst({
        where: {
          OR: [{ id: idOrSlug }, { slug: idOrSlug }],
        },
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
          members: {
            select: {
              id: true,
              createdAt: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      })

      if (!projectOnDb) {
        return reply.status(StatusCode.NOT_FOUND).send()
      }

      return reply.status(StatusCode.OK).send({
        project: {
          ...projectOnDb,
          description: projectOnDb.description ?? undefined,
          icon: projectOnDb.icon ?? undefined,
          background: projectOnDb.background ?? undefined,
          owner: projectOnDb.owner,
          workspace: projectOnDb.workspace,
          members: projectOnDb.members.map((member) => ({
            id: member.id,
            name: member.user.name,
            email: member.user.email,
            createdAt: member.createdAt,
          })),
        },
      })
    }
  )
}
