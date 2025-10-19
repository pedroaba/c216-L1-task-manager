import dayjs from "dayjs"
import type { FastifyReply, FastifyRequest } from "fastify"
import { StatusCode } from "@/constants/status-code"
import { prisma } from "@/lib/prisma"

export async function auth(request: FastifyRequest, reply: FastifyReply) {
  const session = request.cookies.session || String(request.headers.session)

  console.log({ session }, "Session")

  if (!session) {
    return reply.status(StatusCode.UNAUTHORIZED).send()
  }

  const sessionOnDb = await prisma.session.findUnique({
    where: { id: session },
  })

  console.log({ sessionOnDb }, "Session on DB")

  if (!sessionOnDb || sessionOnDb.invalidatedAt) {
    return reply.status(StatusCode.UNAUTHORIZED).send()
  }

  const isExpired = dayjs().diff(sessionOnDb.createdAt, "day") >= 2
  if (isExpired) {
    return reply.status(StatusCode.UNAUTHORIZED).send()
  }
}
