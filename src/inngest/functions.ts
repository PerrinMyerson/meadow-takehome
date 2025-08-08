import { inngest } from "./client";

// Validation helpers
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const sanitizeMovieTitle = (title: string): string => {
  return title.trim().slice(0, 200); // Limit length
};

export const movieWatched = inngest.createFunction(
  { id: "movie-watched" },
  { event: "meadow_api/movie.watched" },
  async ({ event, step }) => {
    const { movie_title, recipient_email } = event.data;

    // Input validation
    if (!movie_title || typeof movie_title !== 'string') {
      throw new Error("Invalid movie title provided");
    }

    if (!recipient_email || !isValidEmail(recipient_email)) {
      throw new Error("Invalid email address provided");
    }

    const sanitizedTitle = sanitizeMovieTitle(movie_title);

    const movieData = await step.run("fetch-movie-data", async () => {
      const omdbApiKey = process.env.OMDB_API_KEY;
      if (!omdbApiKey) {
        throw new Error("OMDb API key not configured");
      }

      // Add timeout to fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      try {
        const response = await fetch(
          `http://www.omdbapi.com/?t=${encodeURIComponent(sanitizedTitle)}&apikey=${omdbApiKey}`,
          { signal: controller.signal }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`OMDb API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.Response === "False") {
          throw new Error(`Movie not found: ${data.Error || "Unknown error"}`);
        }

        // Validate required movie data
        if (!data.Title || !data.Plot) {
          throw new Error("Incomplete movie data received from OMDb API");
        }

        return data;
      } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            throw new Error("OMDb API request timed out");
          }
          throw error;
        }
        throw new Error("Unknown error occurred while fetching movie data");
      }
    });

    const emailResult = await step.run("send-email", async () => {
      const resendApiKey = process.env.RESEND_API_KEY;
      if (!resendApiKey) {
        throw new Error("Resend API key not configured");
      }

      const { Resend } = await import("resend");
      const resend = new Resend(resendApiKey);

      const emailContent = `
        <h2>Movie Summary: ${movieData.Title}</h2>
        <p><strong>Year:</strong> ${movieData.Year || 'N/A'}</p>
        <p><strong>Director:</strong> ${movieData.Director || 'N/A'}</p>
        <p><strong>Plot:</strong> ${movieData.Plot}</p>
        <p><strong>Rating:</strong> ${movieData.imdbRating || 'N/A'}/10</p>
        <p><strong>Genre:</strong> ${movieData.Genre || 'N/A'}</p>
      `;

      try {
        const result = await resend.emails.send({
          from: "send@perr1n.com",
          to: recipient_email,
          subject: `Movie Summary: ${movieData.Title}`,
          html: emailContent,
        });

        if (result.error) {
          throw new Error(`Resend API error: ${result.error.message}`);
        }

        return result;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to send email: ${error.message}`);
        }
        throw new Error("Unknown error occurred while sending email");
      }
    });

    return {
      success: true,
      movie: movieData.Title,
      email_sent_to: recipient_email,
      email_id: emailResult.data?.id,
    };
  },
);
