import { NextResponse } from "next/server";
import { inngest } from "../../../inngest/client";

export const dynamic = "force-dynamic";

// Validation helpers
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const sanitizeMovieTitle = (title: string): string => {
  return title.trim().slice(0, 200);
};

export async function POST(request: Request) {
  try {
    // Check content type
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 400 }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { movie_title, recipient_email } = body;

    // Validate required fields
    if (!movie_title || typeof movie_title !== 'string') {
      return NextResponse.json(
        { error: "movie_title is required and must be a string" },
        { status: 400 }
      );
    }

    if (!recipient_email || typeof recipient_email !== 'string') {
      return NextResponse.json(
        { error: "recipient_email is required and must be a string" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(recipient_email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedTitle = sanitizeMovieTitle(movie_title);
    const sanitizedEmail = recipient_email.trim().toLowerCase();

    // Send event to Inngest
    await inngest.send({
      name: "meadow_api/movie.watched",
      data: { 
        movie_title: sanitizedTitle, 
        recipient_email: sanitizedEmail 
      },
    });

    return NextResponse.json({ 
      message: "Movie watched event sent!",
      movie_title: sanitizedTitle,
      recipient_email: sanitizedEmail
    });
  } catch (error) {
    console.error("Error sending movie event:", error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("network") || error.message.includes("fetch")) {
        return NextResponse.json(
          { error: "Network error occurred while processing request" },
          { status: 503 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
