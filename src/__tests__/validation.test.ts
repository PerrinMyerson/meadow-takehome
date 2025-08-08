// Test validation utilities
describe('Validation utilities', () => {
  // Email validation regex
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Movie title sanitization
  const sanitizeMovieTitle = (title: string): string => {
    return title.trim().slice(0, 200)
  }

  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true)
      expect(isValidEmail('test+tag@example.org')).toBe(true)
    })

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid-email')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
      expect(isValidEmail('test@example')).toBe(false)
      expect(isValidEmail('')).toBe(false)
    })
  })

  describe('sanitizeMovieTitle', () => {
    it('should trim whitespace', () => {
      expect(sanitizeMovieTitle('  The Matrix  ')).toBe('The Matrix')
    })

    it('should limit length to 200 characters', () => {
      const longTitle = 'A'.repeat(250)
      expect(sanitizeMovieTitle(longTitle).length).toBe(200)
    })

    it('should handle empty strings', () => {
      expect(sanitizeMovieTitle('')).toBe('')
    })

    it('should handle strings shorter than 200 characters', () => {
      expect(sanitizeMovieTitle('The Matrix')).toBe('The Matrix')
    })
  })
})
