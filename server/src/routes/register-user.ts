import { hash } from "argon2"
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { StatusCode } from "@/constants/status-code"
import { MIN_NAME_LENGTH, MIN_PASSWORD_LENGTH } from "@/constants/validation"
import { prisma } from "@/lib/prisma"

export const registerUserRoute: FastifyPluginAsyncZod = async (server) => {
  await server.post(
    "/register",
    {
      schema: {
        tags: ["users"],
        summary: "Register a user",
        body: z.object({
          name: z
            .string()
            .min(MIN_NAME_LENGTH, "Nome precisa ter 5 caracteres")
            .meta({
              example: "John Doe",
            }),
          email: z.email("Email inválido").meta({
            example: "john.doe@example.com",
          }),
          password: z
            .string()
            .min(MIN_PASSWORD_LENGTH, "Senha precisa ter 8 caracteres")
            .meta({
              example: "12345678",
            }),
        }),
        response: {
          201: z
            .object({ userId: z.uuid() })
            .describe("Usuário registrado com sucesso!"),
          409: z.void().describe("Usuário já existe!"),
        },
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body

      const userOnDb = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (userOnDb) {
        return reply.status(StatusCode.CONFLICT).send()
      }

      const hashedPassword = await hash(password)
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      })

      return reply.status(StatusCode.CREATED).send({ userId: user.id })
    }
  )
}
