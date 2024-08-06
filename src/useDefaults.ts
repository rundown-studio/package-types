export const REQUIRED = 'REQUIRED'

/**
 * Make sure the return value has all required or default values set
 * @param  {Record<string, any>} values
 * @param  {Record<string, any>} defaults
 * @return {Record<string, any>}
 */
export function useDefaults (
  values: Record<string, any>,
  defaults: Record<string, any>,
): Record<string, any> {
  const output: Record<string, any> = { ...values }
  for (const key in defaults) {
    if (defaults[key] === REQUIRED) {
      if (!values?.[key]) throw new Error(`${key} is required`)
      output[key] = values[key]
    } else {
      output[key] = values?.[key] || defaults[key]
    }
  }
  return output
}
