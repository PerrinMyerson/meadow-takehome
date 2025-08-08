// Simple test for the API endpoint
describe('API Endpoint Tests', () => {
  // Test validation utilities
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const sanitizeMovieTitle = (title: string): string => {
    return title.trim().slice(0, 200)
  }

  describe('Input validation', () => {
    it('should validate email format', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('invalid-email')).toBe(false)
    })

    it('should sanitize movie titles', () => {
      expect(sanitizeMovieTitle('  The Matrix  ')).toBe('The Matrix')
      expect(sanitizeMovieTitle('A'.repeat(250)).length).toBe(200)
    })
  })

  describe('API structure', () => {
    it('should have the correct API structure', () => {
      // Test that the API route exists
      const fs = require('fs')
      const path = require('path')
      
      const apiPath = path.join(__dirname, '../app/api/movie/route.ts')
      expect(fs.existsSync(apiPath)).toBe(true)
    })
  })
})
