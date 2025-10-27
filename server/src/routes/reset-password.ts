import { hash } from "argon2"
import dayjs from "dayjs"
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { StatusCode } from "@/constants/status-code"
import { prisma } from "@/lib/prisma"
import { validatePasswordResetToken } from "@/utils/token"

const MIN_PASSWORD_LENGTH = 8
const MAX_PASSWORD_LENGTH = 100
const TOKEN_EXPIRATION_HOURS = 24

export const resetPassword: FastifyPluginAsyncZod = async (server) => {
  await server.post(
    "/password/reset",
    {
      schema: {
        tags: ["auth", "password", "users"],
        summary: "Reset user password with token",
        description:
          "Resets the user's password using a valid password reset token.",
        body: z.object({
          token: z
            .string()
            .min(1, { message: "Token é obrigatório" })
            .describe("Password reset token")
            .meta({
              example:
                "eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwidGltZXN0YW1wIjoxNjk5OTk5OTk5LCJyYW5kb21TdHJpbmciOiJhYmNkZWYxMjM0NTY3ODkwIn0",
            }),
          newPassword: z
            .string()
            .min(MIN_PASSWORD_LENGTH, {
              message: "Senha deve ter pelo menos 8 caracteres",
            })
            .max(MAX_PASSWORD_LENGTH, {
              message: "Senha deve ter no máximo 100 caracteres",
            })
            .describe("New password")
            .meta({
              example: "MinhaNovaSenh@123",
            }),
        }),
        response: {
          200: z.object({
            message: z.string().describe("Password reset successfully"),
          }),
          400: z.object({
            error: z.string().describe("Invalid token or password"),
          }),
          404: z.object({
            error: z.string().describe("User not found"),
          }),
        },
      },
    },
    async (request, reply) => {
      const { token, newPassword } = request.body
      const recoveryToken = await prisma.recoveryToken.findUnique({
        where: {
          token,
        },
      })

      const defaultErrorMessage =
        "Token inválido. Solicite um novo link de recuperação."

      if (!recoveryToken) {
        return reply.status(StatusCode.BAD_REQUEST).send({
          error: defaultErrorMessage.concat(" (token não encontrado)"),
        })
      }

      if (recoveryToken.expiresAt) {
        return reply.status(StatusCode.BAD_REQUEST).send({
          error: defaultErrorMessage,
        })
      }

      const isExpired =
        dayjs(recoveryToken.createdAt).diff(dayjs(), "hour") >=
        TOKEN_EXPIRATION_HOURS

      if (isExpired) {
        return reply.status(StatusCode.BAD_REQUEST).send({
          error: defaultErrorMessage,
        })
      }

      const tokenValidation = validatePasswordResetToken(token)
      if (!tokenValidation?.isValid) {
        return reply.status(StatusCode.BAD_REQUEST).send({
          error: defaultErrorMessage,
        })
      }

      if (tokenValidation.isExpired) {
        return reply.status(StatusCode.BAD_REQUEST).send({
          error: defaultErrorMessage,
        })
      }

      const user = await prisma.user.findUnique({
        where: { id: tokenValidation.userId },
      })

      if (!user) {
        return reply.status(StatusCode.NOT_FOUND).send({
          error: defaultErrorMessage,
        })
      }

      const hashedPassword = await hash(newPassword)
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
        },
      })

      await prisma.recoveryToken.delete({
        where: { token },
      })

      return reply.status(StatusCode.OK).send({
        message: "Senha redefinida com sucesso",
      })
    }
  )
}
