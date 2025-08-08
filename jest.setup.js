import '@testing-library/jest-dom'

// Mock environment variables
process.env.OMDB_API_KEY = 'test-omdb-key'
process.env.RESEND_API_KEY = 'test-resend-key'

// Mock fetch globally
global.fetch = jest.fn()

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}
