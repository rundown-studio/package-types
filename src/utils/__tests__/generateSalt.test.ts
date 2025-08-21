import { describe, it, expect } from 'vitest'
import { generateSalt } from '../generateSalt'

describe('generateSalt', () => {
  it('should generate a string of default length 16', () => {
    const salt = generateSalt()
    expect(salt).toHaveLength(16)
  })

  it('should generate a string of specified length', () => {
    const salt = generateSalt(32)
    expect(salt).toHaveLength(32)
  })

  it('should generate different strings on multiple calls', () => {
    const salt1 = generateSalt()
    const salt2 = generateSalt()
    expect(salt1).not.toBe(salt2)
  })

  it('should only contain alphanumeric characters', () => {
    const salt = generateSalt(100)
    const alphanumericRegex = /^[A-Za-z0-9]+$/
    expect(salt).toMatch(alphanumericRegex)
  })

  it('should handle edge case of length 0', () => {
    const salt = generateSalt(0)
    expect(salt).toBe('')
  })

  it('should handle length 1', () => {
    const salt = generateSalt(1)
    expect(salt).toHaveLength(1)
    expect(salt).toMatch(/^[A-Za-z0-9]$/)
  })
})