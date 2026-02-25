import { describe, it, expect } from 'vitest'
import { now } from '../utils'

describe('now', () => {
  it('should return ISO formatted date string', () => {
    const result = now()
    expect(typeof result).toBe('string')
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
  })
})
