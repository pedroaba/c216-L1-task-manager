import nodemailer from "nodemailer"
import { env } from "@/env"

export function getNodemailerTransport() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: env.GOOGLE_EMAIL,
      pass: env.GOOGLE_PASSWORD,
    },
  })
}
