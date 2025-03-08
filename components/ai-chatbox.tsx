"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, Sparkles, User, Copy } from "lucide-react";

type Message = {
	role: "ai" | "user";
	content: string;
};

export function AiChatButton() {
	const [isOpen, setIsOpen] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const [messages, setMessages] = useState<Message[]>([
		{
			role: "ai",
			content: "Hi, how can I help you today?",
		},
	]);

	const chatRef = useRef<HTMLDivElement>(null);

	const toggleChat = () => {
		setIsOpen(!isOpen);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!inputValue.trim()) return;

		// Add user message
		const userMessage: Message = {
			role: "user",
			content: inputValue,
		};

		setMessages((prev) => [...prev, userMessage]);

		// Simulate AI response
		setTimeout(() => {
			const aiMessage: Message = {
				role: "ai",
				content:
					"I'm an AI assistant for PromptMarket. How can I help you with buying or selling AI prompts?",
			};
			setMessages((prev) => [...prev, aiMessage]);
		}, 1000);

		setInputValue("");
	};

	// Close modal when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	// Copy message to clipboard
	const handleCopy = (text: string) => {
		navigator.clipboard.writeText(text);
		alert("Copied to clipboard!");
	};

	return (
		<>
			{/* Chat Button */}
      <Button
        onClick={toggleChat}
        className="animate-bounce fixed bottom-4 right-4 rounded-full w-16 h-16 p-0 bg-primary hover:bg-primary/90 shadow-lg z-50"
        aria-label="Open chat"
      >
        <Bot size={32} className=" text-white" />
      </Button>

			{/* Chat Modal */}
			{isOpen && (
				<div
					ref={chatRef}
					className="fixed bottom-[calc(4rem+1.5rem)] right-4 bg-white p-6 rounded-lg border border-border w-[440px] h-[534px] shadow-sm z-50 flex flex-col"
				>
					{/* Header */}
					<div className="flex flex-col space-y-1.5 pb-6">
						<h2 className="font-semibold text-lg tracking-tight">
							PromptMarket AI
						</h2>
						<p className="text-sm text-muted-foreground">
							Ask me anything about prompts and the marketplace
						</p>
					</div>

					{/* Chat Container */}
					<div className="flex-1 overflow-y-auto pr-4 space-y-4">
						{messages.map((message, index) => (
							<div key={index} className="flex gap-3 my-4 text-sm">
								<span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
									<div className="rounded-full bg-muted border p-1">
										{message.role === "ai" ? (
											<Sparkles className="h-5 w-5" />
										) : (
											<User className="h-5 w-5" />
										)}
									</div>
								</span>
								<div className="leading-relaxed flex-1">
									<span className="block font-bold">
										{message.role === "ai" ? "AI" : "You"}
									</span>
									<p className="text-muted-foreground">{message.content}</p>
								</div>
								{/* Copy button */}
								<Button
									variant="ghost"
									size="icon"
									onClick={() => handleCopy(message.content)}
								>
									<Copy className="h-4 w-4" />
								</Button>
							</div>
						))}
					</div>

					{/* Input Box */}
					<div className="pt-4 border-t mt-auto">
						<form
							onSubmit={handleSubmit}
							className="flex items-center space-x-2"
						>
							<Input
								className="flex-1"
								placeholder="Type your message..."
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
							/>
							<Button type="submit">
								<Send className="h-4 w-4 mr-2" />
								Send
							</Button>
						</form>
					</div>
				</div>
			)}
		</>
	);
}
