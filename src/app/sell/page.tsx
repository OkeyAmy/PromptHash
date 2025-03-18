//// filepath: /C:/Users/Admin/OneDrive/Desktop/prompt-hub/app/sell/page.tsx
"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, DollarSign, AlertCircle } from "lucide-react";
import { useState, ChangeEvent, FormEvent } from "react";

interface Listing {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    status: string;
    sales: number;
    revenue: number;
}

const myListings: Listing[] = [
    {
        id: 1,
        title: "Creative Story Generator",
        description:
            "Generate engaging short stories with complex characters and plot twists.",
        price: 0.1,
        category: "Creative Writing",
        status: "Active",
        sales: 12,
        revenue: 1.2,
    },
    {
        id: 2,
        title: "Code Refactoring Assistant",
        description:
            "Improve your code quality with smart refactoring suggestions.",
        price: 0.15,
        category: "Programming",
        status: "Active",
        sales: 8,
        revenue: 1.2,
    },
    {
        id: 3,
        title: "Marketing Email Generator",
        description: "Create compelling marketing emails that convert.",
        price: 0.08,
        category: "Marketing",
        status: "Pending Review",
        sales: 0,
        revenue: 0,
    },
];

interface FormData {
    title: string;
    description: string;
    category: string;
    price: string;
    file: File | null;
}

export default function SellPage() {
    const [formData, setFormData] = useState<FormData>({
        title: "",
        description: "",
        category: "",
        price: "",
        file: null,
    });
    const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | ArrayBuffer | null>(null);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when field is edited
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleCategoryChange = (value: string) => {
        setFormData((prev) => ({ ...prev, category: value }));
        if (errors.category) {
            setErrors((prev) => ({ ...prev, category: null }));
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setFormData((prev) => ({ ...prev, file }));

            // Create preview for image files
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (event.target) {
                        setPreviewImage(event.target.result);
                    }
                };
                reader.readAsDataURL(file);
            } else {
                setPreviewImage(null);
            }

            if (errors.file) {
                setErrors((prev) => ({ ...prev, file: null }));
            }
        }
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.title.trim()) newErrors.title = "Title is required";
        if (!formData.description.trim())
            newErrors.description = "Description is required";
        if (!formData.category) newErrors.category = "Category is required";
        if (!formData.price) newErrors.price = "Price is required";
        else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0)
            newErrors.price = "Price must be a positive number";
        if (!formData.file) newErrors.file = "Prompt file is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validateForm()) {
            setIsSubmitting(true);

            // Simulate API call
            setTimeout(() => {
                setIsSubmitting(false);
                // Reset form after successful submission
                setFormData({
                    title: "",
                    description: "",
                    category: "",
                    price: "",
                    file: null,
                });
                setPreviewImage(null);
                alert("Prompt submitted successfully!");
            }, 1500);
        }
    };

    return (
			<div className="min-h-screen flex flex-col bg-gradient-to-r from-purple-400 to-blue-500">
				<Navigation />
				<main className="flex-1 container py-8 ">
					<div className="max-w-5xl mx-auto ">
						<Tabs defaultValue="new">
							<TabsList className="grid w-full grid-cols-2 ">
								<TabsTrigger value="new">New Prompt</TabsTrigger>
								<TabsTrigger value="listings">My Listings</TabsTrigger>
							</TabsList>

							<TabsContent value="new" className="mt-6">
								<Card>
									<CardHeader>
										<CardTitle>List a New Prompt</CardTitle>
									</CardHeader>
									<CardContent>
										<form onSubmit={handleSubmit} className="space-y-6 ">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
												<div className="space-y-2">
													<label className="text-sm font-medium">Title</label>
													<Input
														placeholder="Enter prompt title"
														name="title"
														value={formData.title}
														onChange={handleChange}
														className={
															errors.title
																? "border-red-500"
																: "border-purple-400"
														}
													/>
													{errors.title && (
														<p className="text-sm text-red-500 flex items-center gap-1">
															<AlertCircle className="h-3 w-3" />
															{errors.title}
														</p>
													)}
												</div>

												<div className="space-y-2">
													<label className="text-sm font-medium">
														Category
													</label>
													<Select
														value={formData.category}
														onValueChange={handleCategoryChange}
													>
														<SelectTrigger
															className={
																errors.category
																	? "border-red-500"
																	: "border-purple-400"
															}
														>
															<SelectValue placeholder="Select category" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="creative">
																Creative Writing
															</SelectItem>
															<SelectItem value="coding">Coding</SelectItem>
															<SelectItem value="marketing">
																Marketing
															</SelectItem>
															<SelectItem value="business">Business</SelectItem>
														</SelectContent>
													</Select>
													{errors.category && (
														<p className="text-sm text-red-500 flex items-center gap-1">
															<AlertCircle className="h-3 w-3" />
															{errors.category}
														</p>
													)}
												</div>
											</div>

											<div className="space-y-2">
												<label className="text-sm font-medium">
													Description
												</label>
												<Textarea
													placeholder="Describe your prompt..."
													name="description"
													value={formData.description}
													onChange={handleChange}
													className={
														errors.description
															? "border-red-500"
															: "border-purple-400"
													}
													rows={4}
												/>
												{errors.description && (
													<p className="text-sm text-red-500 flex items-center gap-1">
														<AlertCircle className="h-3 w-3" />
														{errors.description}
													</p>
												)}
											</div>

											<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
												<div className="space-y-2">
													<label className="text-sm font-medium">
														Price (SOL)
													</label>
													<div className="relative">
														<DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
														<Input
															type="number"
															placeholder="0.00"
															className={`pl-9 ${
																errors.price
																	? "border-red-500"
																	: "border-purple-400"
															}`}
															step="0.01"
															name="price"
															value={formData.price}
															onChange={handleChange}
														/>
													</div>
													{errors.price && (
														<p className="text-sm text-red-500 flex items-center gap-1">
															<AlertCircle className="h-3 w-3" />
															{errors.price}
														</p>
													)}
												</div>

												<div className="space-y-2">
													<label className="text-sm font-medium">
														Upload Prompt File
													</label>
													<div
														className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors ${
															errors.file
																? "border-red-500"
																: "border-purple-400"
														}`}
														onClick={() =>
															document.getElementById("file-upload")?.click()
														}
													>
														{previewImage ? (
															<div className="relative">
																<img
																	src={
																		typeof previewImage === "string"
																			? previewImage
																			: ""
																	}
																	alt="Preview"
																	className="mx-auto max-h-32 object-contain"
																/>
																<p className="mt-2 text-sm text-muted-foreground">
																	{formData.file?.name}
																</p>
															</div>
														) : (
															<>
																<Upload className="h-8 w-8 mx-auto text-muted-foreground" />
																<p className="mt-2 text-sm text-muted-foreground">
																	Drag and drop your prompt file here, or click
																	to browse
																</p>
															</>
														)}
														<Input
															id="file-upload"
															type="file"
															className="hidden"
															onChange={handleFileChange}
														/>
													</div>
													{errors.file && (
														<p className="text-sm text-red-500 flex items-center gap-1">
															<AlertCircle className="h-3 w-3" />
															{errors.file}
														</p>
													)}
												</div>
											</div>

											<Button
												type="submit"
												className="w-full"
												disabled={isSubmitting}
											>
												{isSubmitting ? "Submitting..." : "Submit Prompt"}
											</Button>
										</form>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="listings" className="mt-6">
								<div className="grid gap-6">
									{myListings.map((listing) => (
										<Card key={listing.id}>
											<CardContent className="p-6">
												<div className="flex flex-col md:flex-row gap-4 justify-between">
													<div className="flex-1">
														<div className="flex items-start justify-between">
															<h3 className="text-xl font-semibold">
																{listing.title}
															</h3>
															<Badge
																className={
																	listing.status === "Active"
																		? "bg-green-500"
																		: "bg-yellow-500"
																}
															>
																{listing.status}
															</Badge>
														</div>
														<p className="text-sm text-muted-foreground mt-2 mb-4">
															{listing.description}
														</p>
														<div className="flex flex-wrap gap-4 text-sm">
															<div>
																<span className="text-muted-foreground">
																	Category:
																</span>{" "}
																{listing.category}
															</div>
															<div>
																<span className="text-muted-foreground">
																	Price:
																</span>{" "}
																{listing.price} SOL
															</div>
															<div>
																<span className="text-muted-foreground">
																	Sales:
																</span>{" "}
																{listing.sales}
															</div>
															<div>
																<span className="text-muted-foreground">
																	Revenue:
																</span>{" "}
																{listing.revenue} SOL
															</div>
														</div>
													</div>
													<div className="flex md:flex-col gap-2 self-end md:self-center">
														<Button variant="outline" size="sm">
															Edit
														</Button>
														<Button variant="destructive" size="sm">
															Remove
														</Button>
													</div>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							</TabsContent>
						</Tabs>
					</div>
				</main>
				<Footer />
			</div>
		);
}