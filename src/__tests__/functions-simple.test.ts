// Simple test for the movie function
describe('Movie Function Tests', () => {
  // Test validation utilities
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const sanitizeMovieTitle = (title: string): string => {
    return title.trim().slice(0, 200)
  }

  describe('Email validation', () => {
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

  describe('Movie title sanitization', () => {
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

  describe('Function structure', () => {
    it('should have the correct function structure', () => {
      // Import the function to test its structure
      const { movieWatched } = require('../inngest/functions')
      
      expect(movieWatched).toBeDefined()
      expect(typeof movieWatched).toBe('object')
      // Check if the function has the expected properties
      expect(movieWatched.id).toBeDefined()
      expect(typeof movieWatched.id).toBe('function')
    })
  })
})
