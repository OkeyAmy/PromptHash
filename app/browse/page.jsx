"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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

// Generate 10 prompts per category
const codingPrompts = [
	{
		id: 1,
		title: "Code Snippet Generator",
		description:
			"Generate code snippets for various programming languages quickly and accurately.",
		image: "/browse/code-snippet.png",
		price: 0.05,
		category: "Coding",
		rating: 4.7,
		seller: "CodeMaster.sol",
	},
	{
		id: 2,
		title: "Debugging Assistant",
		description:
			"Analyze your code and suggest fixes for common bugs and issues.",
		image: "/browse/debugging.png",
		price: 0.1,
		category: "Coding",
		rating: 4.8,
		seller: "DebugPro.sol",
	},
	{
		id: 3,
		title: "Algorithm Optimizer",
		description:
			"Optimize your algorithms for improved performance and efficiency.",
		image: "/browse/algorithm.png",
		price: 0.12,
		category: "Coding",
		rating: 4.6,
		seller: "AlgoGenius.sol",
	},
	{
		id: 4,
		title: "API Endpoint Generator",
		description:
			"Quickly generate RESTful API endpoints with integrated documentation.",
		image: "/browse/api.png",
		price: 0.08,
		category: "Coding",
		rating: 4.5,
		seller: "APIMaker.sol",
	},
	{
		id: 5,
		title: "Frontend Component Builder",
		description:
			"Design and build reusable UI components for your web applications.",
		image: "/browse/frontend.png",
		price: 0.15,
		category: "Coding",
		rating: 4.9,
		seller: "UIWizard.sol",
	},
	{
		id: 6,
		title: "Backend Service Generator",
		description:
			"Generate robust backend services with optimized database connections.",
		image: "/browse/backend.png",
		price: 0.2,
		category: "Coding",
		rating: 4.8,
		seller: "BackendGuru.sol",
	},
	{
		id: 7,
		title: "Full Stack Template Creator",
		description:
			"Kickstart your project with a full stack template pre-configured for development.",
		image: "/browse/fullstack.png",
		price: 0.18,
		category: "Coding",
		rating: 4.7,
		seller: "StackHero.sol",
	},
	{
		id: 8,
		title: "Code Refactoring Tool",
		description:
			"Improve your code quality by using automated refactoring tools.",
		image: "/browse/code-refactoring.png",
		price: 0.09,
		category: "Coding",
		rating: 4.4,
		seller: "CleanCode.sol",
	},
	{
		id: 9,
		title: "Unit Test Generator",
		description:
			"Automatically generate unit tests for your codebase to improve reliability.",
		image: "/browse/unit-test.png",
		price: 0.11,
		category: "Coding",
		rating: 4.6,
		seller: "TestPro.sol",
	},
	{
		id: 10,
		title: "Performance Profiler",
		description:
			"Analyze your application performance and identify bottlenecks.",
		image: "/browse/performance.png",
		price: 0.14,
		category: "Coding",
		rating: 4.8,
		seller: "Speedy.sol",
	},
];

const marketingPrompts = [
	{
		id: 11,
		title: "Social Media Ad Creator",
		description:
			"Generate eye-catching social media ads to boost your brand's engagement.",
		image: "/browse/social-media.png",
		price: 0.12,
		category: "Marketing",
		rating: 4.7,
		seller: "AdWizard.sol",
	},
	{
		id: 12,
		title: "Email Campaign Generator",
		description:
			"Create effective email marketing campaigns with targeted messaging.",
		image: "/browse/email-campaign.png",
		price: 0.1,
		category: "Marketing",
		rating: 4.8,
		seller: "MailMaster.sol",
	},
	{
		id: 13,
		title: "SEO Content Assistant",
		description:
			"Optimize your website content for better search engine rankings.",
		image: "/browse/seo.png",
		price: 0.09,
		category: "Marketing",
		rating: 4.6,
		seller: "SEOGuru.sol",
	},
	{
		id: 14,
		title: "Campaign Performance Analyzer",
		description: "Analyze your marketing campaign data to optimize ROI.",
		image: "/browse/campaign.png",
		price: 0.15,
		category: "Marketing",
		rating: 4.8,
		seller: "CampaignPro.sol",
	},
	{
		id: 15,
		title: "Brand Voice Generator",
		description: "Develop a consistent brand voice and messaging strategy.",
		image: "/browse/brand-voice.png",
		price: 0.13,
		category: "Marketing",
		rating: 4.7,
		seller: "VoiceCraft.sol",
	},
	{
		id: 16,
		title: "Content Calendar Planner",
		description: "Plan and schedule your marketing content effectively.",
		image: "/browse/content.png",
		price: 0.1,
		category: "Marketing",
		rating: 4.5,
		seller: "PlanIt.sol",
	},
	{
		id: 17,
		title: "Market Trend Reporter",
		description:
			"Stay updated with the latest market trends and industry insights.",
		image: "/browse/market.png",
		price: 0.11,
		category: "Marketing",
		rating: 4.6,
		seller: "TrendSetter.sol",
	},
	{
		id: 18,
		title: "Ad Copy Generator",
		description: "Produce compelling ad copy for various platforms with ease.",
		image: "/browse/ad-copy.png",
		price: 0.08,
		category: "Marketing",
		rating: 4.4,
		seller: "CopyKing.sol",
	},
	{
		id: 19,
		title: "Influencer Outreach Assistant",
		description:
			"Identify and connect with influencers to amplify your brand's message.",
		image: "/browse/influencer.png",
		price: 0.14,
		category: "Marketing",
		rating: 4.7,
		seller: "Influence.sol",
	},
	{
		id: 20,
		title: "Campaign Budget Optimizer",
		description:
			"Optimize your marketing budget allocation for maximum impact.",
		image: "/browse/campaign-budget.png",
		price: 0.16,
		category: "Marketing",
		rating: 4.8,
		seller: "BudgetPro.sol",
	},
];

const creativeWritingPrompts = [
	{
		id: 21,
		title: "Creative Story Generator",
		description:
			"Generate engaging short stories with complex characters and plot twists.",
		image: "/browse/creative-story.png",
		price: 0.1,
		category: "Creative Writing",
		rating: 4.8,
		seller: "Alice.sol",
	},
	{
		id: 22,
		title: "Poetry Composer",
		description: "Create beautiful poems with inspiring imagery and metaphors.",
		image: "/browse/poetry.png",
		price: 0.09,
		category: "Creative Writing",
		rating: 4.7,
		seller: "VerseMaster.sol",
	},
	{
		id: 23,
		title: "Screenplay Outline Generator",
		description:
			"Draft outlines for captivating screenplays with structured acts and scenes.",
		image: "/browse/screenplay.png",
		price: 0.12,
		category: "Creative Writing",
		rating: 4.6,
		seller: "ScriptWizard.sol",
	},
	{
		id: 24,
		title: "Character Development Assistant",
		description:
			"Develop deep and complex characters for your next masterpiece.",
		image: "/browse/character.png",
		price: 0.11,
		category: "Creative Writing",
		rating: 4.7,
		seller: "CharacterPro.sol",
	},
	{
		id: 25,
		title: "Dialogue Enhancer",
		description:
			"Improve dialogue tone and natural flow for your creative writing projects.",
		image: "/browse/dialogue.png",
		price: 0.1,
		category: "Creative Writing",
		rating: 4.5,
		seller: "Dialogue.sol",
	},
	{
		id: 26,
		title: "Plot Twist Generator",
		description: "Inject unexpected plot twists to keep your readers engaged.",
		image: "/browse/plot-twist.png",
		price: 0.13,
		category: "Creative Writing",
		rating: 4.8,
		seller: "TwistMaster.sol",
	},
	{
		id: 27,
		title: "Setting Creator",
		description:
			"Generate vivid settings and world-building details for your story.",
		image: "/browse/setting-creator.png",
		price: 0.09,
		category: "Creative Writing",
		rating: 4.6,
		seller: "WorldWeaver.sol",
	},
	{
		id: 28,
		title: "Narrative Voice Assistant",
		description:
			"Refine the narrative voice and tone in your creative writing piece.",
		image: "/browse/narrative.png",
		price: 0.1,
		category: "Creative Writing",
		rating: 4.7,
		seller: "Narrate.sol",
	},
	{
		id: 29,
		title: "Short Story Prompt",
		description: "Kickstart your writing with a unique short story prompt.",
		image: "/browse/short-story.png",
		price: 0.08,
		category: "Creative Writing",
		rating: 4.5,
		seller: "StorySpark.sol",
	},
	{
		id: 30,
		title: "Visual Writing Prompt",
		description:
			"Generate creative visual cues to inspire your next writing project.",
		image: "/browse/visual-writing.png",
		price: 0.1,
		category: "Creative Writing",
		rating: 4.7,
		seller: "VisioWord.sol",
	},
];

const businessPrompts = [
	{
		id: 31,
		title: "Business Strategy Advisor",
		description:
			"Receive strategic insights and recommendations to optimize your business operations.",
		image: "/browse/business.png",
		price: 0.2,
		category: "Business",
		rating: 4.9,
		seller: "BizIntel.sol",
	},
	{
		id: 32,
		title: "Market Analysis Generator",
		description:
			"Generate comprehensive market analysis reports based on current trends and data.",
		image: "/browse/market-analysis.png",
		price: 0.15,
		category: "Business",
		rating: 4.7,
		seller: "MarketGuru.sol",
	},
	{
		id: 33,
		title: "Financial Forecasting Tool",
		description:
			"Create detailed financial forecasts and budget recommendations for businesses.",
		image: "/browse/financial-forecasting.png",
		price: 0.25,
		category: "Business",
		rating: 4.8,
		seller: "FinancePro.sol",
	},
	{
		id: 34,
		title: "Operational Efficiency Analyzer",
		description:
			"Analyze your business operations to identify opportunities for efficiency improvements.",
		image: "/browse/operational.png",
		price: 0.18,
		category: "Business",
		rating: 4.6,
		seller: "OpsExpert.sol",
	},
	{
		id: 35,
		title: "Risk Management Advisor",
		description:
			"Receive expert advice on identifying and mitigating business risks.",
		image: "/browse/risk-management.png",
		price: 0.2,
		category: "Business",
		rating: 4.7,
		seller: "RiskMaster.sol",
	},
	{
		id: 36,
		title: "Supply Chain Optimizer",
		description:
			"Streamline your supply chain operations to reduce costs and increase reliability.",
		image: "/browse/supply-chain.png",
		price: 0.22,
		category: "Business",
		rating: 4.8,
		seller: "ChainPro.sol",
	},
	{
		id: 37,
		title: "Customer Insights Generator",
		description:
			"Generate actionable insights based on customer data and behavior.",
		image: "/browse/customer.png",
		price: 0.17,
		category: "Business",
		rating: 4.7,
		seller: "Insight.sol",
	},
	{
		id: 38,
		title: "Investor Pitch Deck Creator",
		description:
			"Develop compelling pitch decks to attract investors for your startup.",
		image: "/browse/investor.png",
		price: 0.23,
		category: "Business",
		rating: 4.8,
		seller: "PitchPro.sol",
	},
	{
		id: 39,
		title: "Business Plan Outliner",
		description:
			"Create comprehensive business plans with in-depth market and operational insights.",
		image: "/browse/business-plan.png",
		price: 0.19,
		category: "Business",
		rating: 4.6,
		seller: "PlanMaster.sol",
	},
	{
		id: 40,
		title: "Sales Forecasting Tool",
		description:
			"Predict sales trends and enhance performance using advanced analytics.",
		image: "/browse/sales.png",
		price: 0.2,
		category: "Business",
		rating: 4.7,
		seller: "SalesGuru.sol",
	},
];

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
