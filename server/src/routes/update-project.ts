import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { StatusCode } from "@/constants/status-code"
import { MIN_NAME_LENGTH } from "@/constants/validation"
import { prisma } from "@/lib/prisma"
import { slugify } from "@/utils/slugify"

async function validateSlugUpdate(
  newName: string,
  currentSlug: string,
  projectId: string
): Promise<string | null> {
  const newSlug = slugify(newName)

  if (newSlug === currentSlug) {
    return null // No slug change needed
  }

  const existingProject = await prisma.project.findFirst({
    where: {
      slug: newSlug,
      id: { not: projectId },
    },
  })

  if (existingProject) {
    throw new Error("SLUG_CONFLICT")
  }

  return newSlug
}

function buildUpdateData(
  name: string | undefined,
  description: string | undefined,
  icon: string | undefined,
  background: string | undefined
): {
  name?: string
  slug?: string
  description?: string
  icon?: string
  background?: string
} {
  const updateData: {
    name?: string
    slug?: string
    description?: string
    icon?: string
    background?: string
  } = {}

  if (name !== undefined) {
    updateData.name = name
  }

  if (description !== undefined) {
    updateData.description = description
  }

  if (icon !== undefined) {
    updateData.icon = icon
  }

  if (background !== undefined) {
    updateData.background = background
  }

  return updateData
}

async function handleSlugUpdate(
  name: string | undefined,
  currentSlug: string,
  projectId: string
): Promise<string | null> {
  if (name === undefined) {
    return null
  }

  try {
    return await validateSlugUpdate(name, currentSlug, projectId)
  } catch (error) {
    if (error instanceof Error && error.message === "SLUG_CONFLICT") {
      throw error
    }
    throw error
  }
}

async function findProjectByIdOrSlug(idOrSlug: string) {
  return await prisma.project.findFirst({
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
    },
  })
}

async function updateProjectInDatabase(
  projectId: string,
  updateData: {
    name?: string
    slug?: string
    description?: string
    icon?: string
    background?: string
  }
) {
  return await prisma.project.update({
    where: {
      id: projectId,
    },
    data: updateData,
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
    },
  })
}

type UpdateProjectData = {
  name?: string
  description?: string
  icon?: string
  background?: string
}

async function processProjectUpdate(
  updateData: UpdateProjectData,
  currentSlug: string,
  projectId: string
): Promise<{
  name?: string
  slug?: string
  description?: string
  icon?: string
  background?: string
}> {
  const data = buildUpdateData(
    updateData.name,
    updateData.description,
    updateData.icon,
    updateData.background
  )

  try {
    const newSlug = await handleSlugUpdate(
      updateData.name,
      currentSlug,
      projectId
    )
    if (newSlug) {
      data.slug = newSlug
    }
  } catch (error) {
    if (error instanceof Error && error.message === "SLUG_CONFLICT") {
      throw new Error("SLUG_CONFLICT")
    }
    throw error
  }

  return data
}

export const updateProjectRoute: FastifyPluginAsyncZod = async (server) => {
  await server.put(
    "/:idOrSlug",
    {
      schema: {
        tags: ["project"],
        summary: "Update a project by id or slug",
        description:
          "Update a project by id or slug. This endpoint requires a valid session cookie or session header for authentication.",
        security: [{ cookie: [], session: [] }],
        params: z.object({
          idOrSlug: z.string().meta({
            example: "V1StGXR8_Z5jdHi6B-myT",
          }),
        }),
        body: z.object({
          name: z
            .string()
            .min(MIN_NAME_LENGTH, "Nome precisa ter 5 caracteres")
            .optional()
            .meta({
              example: "Updated Project Name",
            }),
          description: z.string().optional().meta({
            example: "Updated description of the project",
          }),
          icon: z.string().optional().meta({
            example: "Folder",
          }),
          background: z.string().optional().meta({
            example: "#1a1a1a",
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
              }),
            })
            .describe("Project updated successfully!")
            .meta({
              example: {
                project: {
                  id: "V1StGXR8_Z5jdHi6B-myT",
                  name: "Updated Project Name",
                  slug: "updated-project-name",
                  description: "Updated description of the project",
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
                },
              },
            }),
          401: z.void().describe("Unauthorized - user not logged in"),
          403: z
            .void()
            .describe("Forbidden - user is not the owner of the project"),
          404: z.void().describe("Project not found!"),
          409: z.void().describe("Project slug already exists!"),
        },
      },
    },
    async (request, reply) => {
      const { idOrSlug } = request.params
      const { name, description, icon, background } = request.body

      const user = await request.getLoggedUser(request)
      if (!user) {
        return reply.status(StatusCode.UNAUTHORIZED).send()
      }

      const projectOnDb = await findProjectByIdOrSlug(idOrSlug)

      if (!projectOnDb) {
        return reply.status(StatusCode.NOT_FOUND).send()
      }

      if (user.id !== projectOnDb.ownerId) {
        return reply.status(StatusCode.FORBIDDEN).send()
      }

      try {
        const updateData = await processProjectUpdate(
          { name, description, icon, background },
          projectOnDb.slug,
          projectOnDb.id
        )

        const updatedProject = await updateProjectInDatabase(
          projectOnDb.id,
          updateData
        )

        return reply.status(StatusCode.OK).send({
          project: {
            ...updatedProject,
            description: updatedProject.description ?? undefined,
            icon: updatedProject.icon ?? undefined,
            background: updatedProject.background ?? undefined,
            owner: updatedProject.owner,
            workspace: updatedProject.workspace,
          },
        })
      } catch (error) {
        if (error instanceof Error && error.message === "SLUG_CONFLICT") {
          return reply.status(StatusCode.CONFLICT).send()
        }
        throw error
      }
    }
  )
}
