const ALPHANUMERIC_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

/**
 * Generate a random alphanumeric string of specified length
 * Works in both Node.js and browser environments
 * @param length - The length of the string to generate
 * @returns A random alphanumeric string
 */
export function generateSalt (length: number = 16): string {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += ALPHANUMERIC_CHARS.charAt(Math.floor(Math.random() * ALPHANUMERIC_CHARS.length))
  }
  return result
}
