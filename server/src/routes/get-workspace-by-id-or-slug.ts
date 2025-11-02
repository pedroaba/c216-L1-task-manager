import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { StatusCode } from "@/constants/status-code"
import { prisma } from "@/lib/prisma"

export const getWorkspaceByIdOrSlugRoute: FastifyPluginAsyncZod = async (
  server
) => {
  server.get(
    "/:idOrSlug",
    {
      schema: {
        tags: ["workspace"],
        summary: "Get a workspace by id or slug",
        description:
          "Get a workspace by id or slug. This endpoint requires a valid session cookie or session header for authentication.",
        security: [{ cookie: [], session: [] }],
        params: z.object({
          idOrSlug: z.string().meta({
            example: "V1StGXR8_Z5jdHi6B-myT",
          }),
        }),
        response: {
          200: z
            .object({
              workspace: z.object({
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
                members: z.array(
                  z.object({
                    id: z.string(),
                    name: z.string(),
                    email: z.string(),
                    lastAccessedAt: z.date().optional(),
                  })
                ),
              }),
            })
            .describe("Workspace found successfully!")
            .meta({
              example: {
                workspace: {
                  id: "V1StGXR8_Z5jdHi6B-myT",
                  name: "John Doe",
                  slug: "john-doe",
                  description: "This is a description of the workspace",
                  owner: {
                    id: "123e4567-e89b-12d3-a456-426614174000",
                    name: "John Doe",
                    email: "john.doe@example.com",
                  },
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  members: [
                    {
                      id: "123e4567-e89b-12d3-a456-426614174000",
                      name: "John Doe",
                      email: "john.doe@example.com",
                    },
                    {
                      id: "123e4567-e89b-12d3-a456-426614174000",
                      name: "Jane Doe",
                      email: "jane.doe@example.com",
                    },
                  ],
                },
              },
            }),
          401: z.void().describe("Unauthorized - user not logged in"),
          404: z.void().describe("Workspace not found!"),
        },
      },
    },
    async (request, reply) => {
      const { idOrSlug } = request.params

      const workspaceOnDb = await prisma.workspace.findFirst({
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
          members: {
            select: {
              id: true,
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

      if (!workspaceOnDb) {
        return reply.status(StatusCode.NOT_FOUND).send()
      }

      return reply.status(StatusCode.OK).send({
        workspace: {
          ...workspaceOnDb,
          description: workspaceOnDb.description ?? undefined,
          owner: workspaceOnDb.owner,
          members: workspaceOnDb.members.map(
            (member: {
              id: string
              user: { id: string; name: string; email: string }
            }) => ({
              id: member.id,
              name: member.user.name,
              email: member.user.email,
            })
          ),
        },
      })
    }
  )
}
