import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { StatusCode } from "@/constants/status-code"
import { env } from "@/env"
import { getNodemailerTransport } from "@/lib/nodemailer"
import { prisma } from "@/lib/prisma"
import {
  resetPasswordTemplate,
  resetPasswordTextTemplate,
} from "@/templates/reset-password"
import { generatePasswordResetToken } from "@/utils/token"

export const sendForgotPasswordEmail: FastifyPluginAsyncZod = async (
  server
) => {
  server.post(
    "/password/forgot",
    {
      schema: {
        tags: ["auth", "password", "users"],
        summary: "Send password recovery email to user",
        description:
          "Sends a password recovery email to the user with a link to reset their password.",
        body: z.object({
          email: z
            .email({
              message: "Email inválido",
            })
            .describe("Email to send forgot password email to")
            .meta({
              example: "john.doe@example.com",
            }),
        }),
        response: {
          200: z.void().describe("Forgot password email sent!"),
          400: z.void().describe("Invalid email!"),
          404: z.void().describe("User not found!"),
        },
      },
    },
    async (request, reply) => {
      const { email } = request.body

      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        return reply.status(StatusCode.NOT_FOUND).send()
      }

      const token = generatePasswordResetToken(user.id)
      const url = `${env.BASE_FRONTEND_URL}/reset-password?token=${token}`

      await prisma.recoveryToken.create({
        data: {
          token,
          userId: user.id,
        },
      })

      const transport = getNodemailerTransport()
      await transport.sendMail({
        to: user.email,
        subject: "Recuperação de senha - Taskerra",
        html: resetPasswordTemplate(url),
        text: resetPasswordTextTemplate(url),
      })

      return reply.status(StatusCode.OK).send()
    }
  )
}
