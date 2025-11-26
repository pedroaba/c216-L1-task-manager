import cookie from "@fastify/cookie"
import fastifyCors from "@fastify/cors"
import { fastifySwagger } from "@fastify/swagger"
import fastify from "fastify"
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod"
import { env } from "./env"
import { createProjectRoute } from "./routes/create-project"
import { createWorkspaceRoute } from "./routes/create-workspace"
import { deleteProjectRoute } from "./routes/delete-project"
import { deleteWorkspaceRoute } from "./routes/delete-workspace"
import { getProjectByIdOrSlugRoute } from "./routes/get-project-by-id-or-slug"
import { getUserRoute } from "./routes/get-user"
import { getWorkspaceByIdOrSlugRoute } from "./routes/get-workspace-by-id-or-slug"
import { healthRoute } from "./routes/health"
import { listProjectRoute } from "./routes/list-project"
import { listWorkspaceRoute } from "./routes/list-workspace"
import { meRoute } from "./routes/me"
import { getSessionPlugin } from "./routes/plugin/get-session"
import { registerUserRoute } from "./routes/register-user"
import { resetPassword } from "./routes/reset-password"
import { sendForgotPasswordEmail } from "./routes/send-forgot-password-email"
import { signInRoute } from "./routes/sign-in"
import { signOutRoute } from "./routes/sign-out"
import { updateProfileRoute } from "./routes/update-profile"
import { updateProjectRoute } from "./routes/update-project"
import { createTaskRoute } from "./routes/create-task"
import { deleteTaskRoute } from "./routes/delete-task"
import { getTaskByIdRoute } from "./routes/get-task-by-id"
import { listTaskRoute } from "./routes/list-task"
import { updateTaskRoute } from "./routes/update-task"

export const app = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
}).withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "session"],
})

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(getSessionPlugin)

app.register(cookie, {
  secret: env.SECRET_KEY,
  prefix: "fono",
})

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Task Management API",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        cookie: {
          type: "apiKey",
          name: "session",
          in: "cookie",
        },
        session: {
          type: "apiKey",
          name: "session",
          in: "header",
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})

app.register(import("@scalar/fastify-api-reference"), {
  routePrefix: "/reference",
  configuration: {
    title: "Task Management API Reference",
    pageTitle: "Task Management API Reference",
    theme: "fastify",
  },
})

app.register(healthRoute)

// users
app.register(registerUserRoute, {
  prefix: "/users",
})

app.register(getUserRoute, {
  prefix: "/users",
})

app.register(meRoute, {
  prefix: "/users",
})

app.register(updateProfileRoute, {
  prefix: "/users",
})

// auth
app.register(signInRoute, {
  prefix: "/auth",
})

app.register(signOutRoute, {
  prefix: "/auth",
})

app.register(sendForgotPasswordEmail, {
  prefix: "/auth",
})

app.register(resetPassword, {
  prefix: "/auth",
})

// workspaces
app.register(createWorkspaceRoute, {
  prefix: "/workspace",
})

app.register(getWorkspaceByIdOrSlugRoute, {
  prefix: "/workspace",
})

app.register(deleteWorkspaceRoute, {
  prefix: "/workspace",
})

app.register(listWorkspaceRoute, {
  prefix: "/workspace",
})

// projects
app.register(createProjectRoute, {
  prefix: "/project",
})

app.register(getProjectByIdOrSlugRoute, {
  prefix: "/project",
})

app.register(updateProjectRoute, {
  prefix: "/project",
})

app.register(deleteProjectRoute, {
  prefix: "/project",
})

app.register(listProjectRoute, {
  prefix: "/project",
})

// tasks
// Register specific routes (/:id) before generic routes (/) to avoid conflicts
app.register(getTaskByIdRoute, {
  prefix: "/task",
})

app.register(updateTaskRoute, {
  prefix: "/task",
})

app.register(deleteTaskRoute, {
  prefix: "/task",
})

app.register(createTaskRoute, {
  prefix: "/task",
})

app.register(listTaskRoute, {
  prefix: "/task",
})
