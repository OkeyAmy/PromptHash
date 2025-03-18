import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
	const { messages } = await req.json();

	// Convert messages to the format expected by the AI SDK
	const formattedMessages = messages.map((message: any) => ({
		role: message.role === "ai" ? "assistant" : "user",
		content: message.content,
	}));

	const result = streamText({
		model: openai("gpt-4o"),
		messages: formattedMessages,
	});

	return result.toDataStreamResponse();
}
