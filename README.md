# Meadow Coding Exercise – Movie Email Service

A production-ready Inngest function that fetches movie data from OMDb and emails a summary via Resend.

## Overview

* Listens for `meadow_api/movie.watched` events
* Looks up the movie in OMDb (full plot)
* Sends a formatted summary email using Resend

## Setup (quick)

* Prereqs: Node.js 18+, OMDb API key, Resend API key, verified Resend domain
* Install deps and set environment variables for OMDb and Resend
* Run your Next.js app and the Inngest Dev Server

## Usage

* Trigger via an API endpoint that accepts `movie_title` and `recipient_email`
* Or invoke the `movie-watched` function from the Inngest Dev UI
* Monitor runs and step logs in the Inngest Dev Server

## Features

* Durable execution with automatic retries
* Validated inputs and clear error responses
* Step-by-step observability
* Type-safe implementation

## Email Content

Includes title, year, director, plot summary, IMDb rating, and genre. Sends both HTML and plain text for deliverability.

## Project Structure

* `src/inngest/` – Inngest client and function
* `src/app/api/inngest/` – Inngest route
* `src/app/api/movie/` – Event trigger route

## Testing

### Test Suites

The project includes comprehensive test coverage:

* **Unit Tests** (`src/inngest/__tests__/functions.test.ts`): Test individual function logic, input validation, error handling
* **API Tests** (`src/app/api/__tests__/movie.test.ts`): Test the movie API endpoint, request validation, error responses
* **Integration Tests** (`src/__tests__/integration.test.ts`): Test complete end-to-end workflows
* **Validation Tests** (`src/__tests__/validation.test.ts`): Test utility functions for email validation and data sanitization
* **Fixtures** (`src/__tests__/fixtures/omdb-responses.ts`): Mock OMDb API responses for testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI
npm run test:ci
```

### Test Coverage

Tests cover:
* Input validation (email format, movie title)
* Error handling (API failures, timeouts, invalid data)
* Data sanitization (trimming, length limits)
* MDb API integration (success, not found, errors)
* Resend email sending (success, failures)
* Edge cases (missing data, long titles, N/A values)
* API endpoint validation and error responses

## Assumptions

* API keys provided via environment variables
* Resend domain (e.g., `send@perr1n.com`) is verified
* Outbound network access available
* Resend handles actual delivery

## Testing

* Invoke from the Inngest Dev UI with sample data
* Hit the API endpoint with test payloads
* Check Inngest logs for each step's output

## Recommendations 

* **Resilience:**  Timeouts, exponential backoff with jitter; retry 5xx/429, not 4xx. Maybe a circuit breaker for OMDb outages.
* **Idempotency:** An idempotency key from title+recipient, upsert a send record to avoid duplicates
* **Validation:**Strict schemas for movie title and email, normalize inputs.
* **Caching:** Cache successful OMDb lookups for a day or two, cache "not found" briefly to reduce thrash.
* **Deliverability:** Configure SPF/DKIM/DMARC & always include a plain-text fallback.
* **Observability:** Emit structured logs and simple metrics (request latency, sends, failures).
* **Controls:** Limit concurrency and rate-limit the public trigger route; add basic security headers
* **Production:** Provide a simple health check covering OMDb, Resend, and cache.

## License

MIT
