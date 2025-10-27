import { randomBytes } from "node:crypto"

const RANDOM_BYTES_LENGTH = 32
const TOKEN_EXPIRATION_HOURS = 24
const SECONDS_PER_MINUTE = 60
const MINUTES_PER_HOUR = 60
const MS_PER_SECOND = 1000
const TOKEN_EXPIRATION_MS =
  TOKEN_EXPIRATION_HOURS * MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MS_PER_SECOND

/**
 * Generates a secure token for password recovery
 * @param userId - User ID
 * @returns Base64 encoded token containing userId, timestamp and random string
 */
export function generatePasswordResetToken(userId: string): string {
  const randomString = randomBytes(RANDOM_BYTES_LENGTH).toString("hex")
  const timestamp = Date.now().toString()
  const tokenData = `${userId}|${timestamp}|${randomString}`

  return Buffer.from(tokenData).toString("base64url")
}

/**
 * Object containing the validation results of a password recovery token
 */
type PasswordResetTokenValidation = {
  userId: string
  timestamp: number
  isValid: boolean
  isExpired: boolean
}

/**
 * Validates and decodes a password recovery token
 * @param token - Encoded token
 * @returns {PasswordResetTokenValidation} with userId, timestamp and isValid, or null if invalid
 */
export function validatePasswordResetToken(
  token: string
): PasswordResetTokenValidation | null {
  try {
    // decode the token
    const decodedToken = Buffer.from(token, "base64url").toString("utf-8")
    const [userId, timestamp, randomString] = decodedToken.split("|")

    const hasValidComponents =
      userId?.trim() && timestamp?.trim() && randomString?.trim()
    if (!hasValidComponents) {
      return null
    }

    const timestampNumber = Number.parseInt(timestamp, 10)
    if (Number.isNaN(timestampNumber)) {
      return null
    }

    const isExpired = Date.now() - timestampNumber > TOKEN_EXPIRATION_MS

    return {
      userId,
      timestamp: timestampNumber,
      isValid: true,
      isExpired,
    }
  } catch {
    return null
  }
}

/**
 * Verifica se um token de recuperação de senha é válido e não expirou
 * @param token - Token a ser verificado
 * @returns true se o token é válido e não expirou, false caso contrário
 */
export function isPasswordResetTokenValid(token: string): boolean {
  const validation = validatePasswordResetToken(token)
  return Boolean(validation?.isValid && !validation.isExpired)
}
