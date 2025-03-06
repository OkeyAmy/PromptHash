"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { codingPrompts, marketingPrompts, creativeWritingPrompts, businessPrompts } from "./prompt";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
	StarIcon,
	Filter,
	ArrowRight,
	Search,
	Eye,
	ShoppingCart,
} from "lucide-react";
import { useState } from "react";



const prompts = [
	...codingPrompts,
	...marketingPrompts,
	...creativeWritingPrompts,
	...businessPrompts,
];

export default function BrowsePage() {
	const [priceRange, setPriceRange] = useState([0, 1]);
	const [selectedPrompt, setSelectedPrompt] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const openModal = (prompt) => {
		setSelectedPrompt(prompt);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	return (
		<div className="min-h-screen bg-gray-950 bg-gradient-to-r from-purple-400 to-blue-500 flex flex-col">
			<Navigation />
			<main className="flex-1 container py-8">
				<div className="flex flex-col md:flex-row gap-8">
					{/* Filters Sidebar */}
					<aside className="w-full md:w-64 space-y-6">
						<div className="space-y-4">
							<h2 className="text-lg font-semibold flex items-center gap-2">
								<Filter className="h-5 w-5" />
								Filters
							</h2>
							<div className="space-y-2">
								<label className="text-sm font-medium">Category</label>
								<Select>
									<SelectTrigger>
										<SelectValue placeholder="Select category" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="creative">Creative Writing</SelectItem>
										<SelectItem value="coding">Coding</SelectItem>
										<SelectItem value="marketing">Marketing</SelectItem>
										<SelectItem value="business">Business</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium">Price Range (SOL)</label>
								<Slider
									value={priceRange}
									onValueChange={setPriceRange}
									max={1}
									step={0.01}
								/>
								<div className="flex justify-between text-sm text-muted-foreground">
									<span>{priceRange[0]} SOL</span>
									<span>{priceRange[1]} SOL</span>
								</div>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium">Sort By</label>
								<Select defaultValue="recent">
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="recent">Most Recent</SelectItem>
										<SelectItem value="popular">Most Popular</SelectItem>
										<SelectItem value="price-low">
											Price: Low to High
										</SelectItem>
										<SelectItem value="price-high">
											Price: High to Low
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</aside>

					{/* Prompts Grid */}
					<div className="flex-1 space-y-6 ">
						<div className="flex items-center gap-4">
							<Input placeholder="Search prompts..." className="max-w-md" />
							<Button>
								<Search className="mr-2 h-4 w-4" />
								Search
							</Button>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{prompts.map((prompt) => (
								<Card
									key={prompt.id}
									className="group relative overflow-hidden transition-all hover:shadow-lg"
								>
									<div className="aspect-video relative overflow-hidden">
										<img
											src={
												prompt.image || "/browse/"
											}
											alt={prompt.title}
											className="object-cover w-full h-full transition-transform group-hover:scale-105"
										/>
										<Badge className="absolute top-2 right-2">
											{prompt.category}
										</Badge>
									</div>
									<CardContent className="p-4">
										<h3 className="font-semibold">{prompt.title}</h3>
										<p className="text-sm text-muted-foreground mt-1 line-clamp-2">
											{prompt.description}
										</p>
										<div className="flex items-center gap-2 mt-2">
											<div className="flex items-center gap-1 text-yellow-500">
												<StarIcon className="h-4 w-4 fill-current" />
												<span className="text-sm">{prompt.rating}</span>
											</div>
											<p className="text-sm text-muted-foreground">
												Seller: {prompt.seller}
											</p>
										</div>
									</CardContent>
									<CardFooter className="p-4 pt-0 flex justify-between items-center">
										<span className="text-lg font-bold">
											{prompt.price} SOL
										</span>
										<Button onClick={() => openModal(prompt)}>
											<Eye className="mr-2 h-4 w-4" />
											View Details
										</Button>
									</CardFooter>
								</Card>
							))}
						</div>
					</div>
				</div>

				{/* Prompt Detail Modal */}
				{isModalOpen && selectedPrompt && (
					<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
						<div className="bg-background rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
							<div className="p-6">
								<div className="flex justify-between items-start mb-4">
									<h2 className="text-2xl font-bold">{selectedPrompt.title}</h2>
									<button
										onClick={closeModal}
										className="text-muted-foreground hover:text-foreground"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<line x1="18" y1="6" x2="6" y2="18"></line>
											<line x1="6" y1="6" x2="18" y2="18"></line>
										</svg>
									</button>
								</div>

								<div className="aspect-video mb-4 rounded-lg overflow-hidden">
									<img
										src={
											selectedPrompt.image ||
											"/placeholder.svg?height=400&width=600"
										}
										alt={selectedPrompt.title}
										className="w-full h-full object-cover"
									/>
								</div>

								<div className="flex items-center justify-between mb-4">
									<Badge>{selectedPrompt.category}</Badge>
									<div className="flex items-center gap-1 text-yellow-500">
										<StarIcon className="h-4 w-4 fill-current" />
										<span>{selectedPrompt.rating}</span>
									</div>
								</div>

								<div className="mb-4">
									<h3 className="text-lg font-semibold mb-2">Description</h3>
									<p className="text-muted-foreground">
										{selectedPrompt.description}
									</p>
								</div>

								<div className="mb-6">
									<h3 className="text-lg font-semibold mb-2">Seller</h3>
									<div className="flex items-center gap-2">
										<div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
											{selectedPrompt.seller.charAt(0)}
										</div>
										<span>{selectedPrompt.seller}</span>
									</div>
								</div>

								<div className="flex justify-between items-center">
									<span className="text-2xl font-bold">
										{selectedPrompt.price} SOL
									</span>
									<Button size="lg">
										<ShoppingCart className="mr-2 h-4 w-4" />
										Buy Now
									</Button>
								</div>
							</div>
						</div>
					</div>
				)}
			</main>
			<Footer />
		</div>
	);
}
