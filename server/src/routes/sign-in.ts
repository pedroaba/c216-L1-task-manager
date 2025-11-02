import { verify } from "argon2"
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { StatusCode } from "@/constants/status-code"
import { prisma } from "@/lib/prisma"
import { Session } from "@/lib/session"

export const signInRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/sign-in",
    {
      schema: {
        tags: ["auth"],
        summary: "User authentication",
        description:
          "Authenticates a user with email and password credentials, establishing a secure session for accessing protected resources.",
        body: z.object({
          email: z
            .email({
              message: "Email inválido",
            })
            .meta({
              example: "john.doe@example.com",
            }),
          password: z
            .string({
              message: "Senha inválida",
            })
            .meta({
              example: "12345678",
            }),
        }),
        response: {
          200: z
            .object({ token: z.string() })
            .meta({
              example: {
                token:
                  "{environment}:anaslkcnaloskncaloskncoaisbcoqwbqewboqwbqewboqwb",
              },
            })
            .describe("User authenticated successfully!"),
          401: z.void().describe("User not authenticated!"),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        return reply.status(StatusCode.UNAUTHORIZED).send()
      }

      const isPasswordsMatch = await verify(user.password, password)
      if (!isPasswordsMatch) {
        return reply.status(StatusCode.UNAUTHORIZED).send()
      }

      await Session.invalidateOlderSessions(user.id)

      const token = Session.token()
      await prisma.session.create({
        data: { id: token, userId: user.id },
      })

      return reply
        .setCookie("session", token)
        .status(StatusCode.OK)
        .send({ token })
    }
  )
}
