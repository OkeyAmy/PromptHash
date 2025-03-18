// This is a proxy endpoint to help debug the improve-prompt API issues
import { NextResponse } from "next/server";

const API_BASE_URL = "https://secret-ai-gateway.onrender.com";

export async function POST(request: Request) {
	try {
		// Get the request body as text instead of JSON
		const promptText = await request.text();

		// Log the request body for debugging
		console.log("Improve prompt request:", promptText);

		// Forward the request to the actual API
		const response = await fetch(`${API_BASE_URL}/api/improve-prompt`, {
			method: "POST",
			headers: {
				"Content-Type": "text/plain",
				Accept: "application/json",
			},
			body: promptText,
		});

		// Get the response data
		const responseData = await response.json().catch(() => null);
		const responseText = await response.text().catch(() => null);

		// Log the response for debugging
		console.log("Improve prompt response status:", response.status);
		console.log("Improve prompt response data:", responseData || responseText);

		// If the response is not OK, return the error details
		if (!response.ok) {
			return NextResponse.json(
				{ error: "API Error", details: responseData || responseText },
				{ status: response.status }
			);
		}

		// Return the successful response
		return NextResponse.json(responseData);
	} catch (error) {
		console.error("Error in improve-proxy:", error);
		return NextResponse.json(
			{
				error: "Internal Server Error",
				message: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 }
		);
	}
}
