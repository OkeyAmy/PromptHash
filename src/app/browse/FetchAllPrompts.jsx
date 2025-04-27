"use client";

import { useState, useEffect } from "react";
import { ethers, toBigInt } from "ethers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  StarIcon,
  Eye,
  ShoppingCart,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import contractABI from "../../../contracts/PromptHashAbi.json";

const ITEMS_PER_PAGE = 10;

const FetchAllPrompts = ({
  selectedCategory = "",
  priceRange = [0, 1000], // Default price range
  searchQuery = "",
}) => {
  const [prompts, setPrompts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchPrompts();
  }, [selectedCategory, priceRange, searchQuery]); // Add dependencies to useEffect

  const fetchPrompts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!window.ethereum) {
        throw new Error("Please install MetaMask");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);

      const contractAddress = process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESS;
      if (!contractAddress) {
        throw new Error("Contract address not found");
      }

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );

      // Get all prompts
      const rawPrompts = await contract.getAllPrompts();
      // Format the prompts from the tuple array
      const formattedPrompts = rawPrompts.map((tuple) => ({
        id: tuple[0].toString(), // promptId
        title: tuple[1], // title
        description: tuple[2], // description
        category: tuple[3], // category
        imageUrl: tuple[4], // imageUrl
        price: ethers.formatEther(tuple[5]), // price (convert from wei)
        likes: tuple[6].toString(), // likes
        owner: tuple[7], // owner address
        exists: tuple[8], // exists
        onSale: tuple[9], // onSale
      }));

      console.log("Formatted prompts before filtering:", formattedPrompts);

      // Split the filtering into steps for debugging
      let filteredPrompts = formattedPrompts;

      // 1. Filter by exists and onSale
      filteredPrompts = filteredPrompts.filter((prompt) => {
        console.log(
          `Prompt ${prompt.id} - exists: ${prompt.exists}, onSale: ${prompt.onSale}`
        );
        return prompt.exists && prompt.onSale;
      });
      console.log("After exists/onSale filter:", filteredPrompts);

      // 2. Filter by category if selected
      if (selectedCategory) {
        filteredPrompts = filteredPrompts.filter((prompt) => {
          console.log(
            `Prompt ${prompt.id} - category: ${prompt.category}, selected: ${selectedCategory}`
          );
          return prompt.category === selectedCategory;
        });
        console.log("After category filter:", filteredPrompts);
      }

      // 3. Filter by search query if present
      if (searchQuery) {
        filteredPrompts = filteredPrompts.filter((prompt) => {
          const matchesTitle = prompt.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
          const matchesDesc = prompt.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
          console.log(
            `Prompt ${prompt.id} - matches search: ${
              matchesTitle || matchesDesc
            }`
          );
          return matchesTitle || matchesDesc;
        });
        console.log("After search filter:", filteredPrompts);
      }

      // 4. Filter by price range
      filteredPrompts = filteredPrompts.filter((prompt) => {
        const price = Number(prompt.price); // Convert to HBAR
        console.log(
          `Prompt ${prompt.id} - price: ${price}, range: ${priceRange[0]} to ${priceRange[1]}`
        );
        return price >= priceRange[0] && price <= priceRange[1];
      });
      console.log("After price filter:", filteredPrompts);

      console.log("Final filtered prompts:", filteredPrompts);
      setPrompts(filteredPrompts);
    } catch (error) {
      console.error("Error fetching prompts:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [selectedCategory, priceRange, searchQuery]);

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "/images/codeguru.png";
  };

  const openModal = (prompt) => {
    setSelectedPrompt(prompt);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPrompt(null);
  };

  const handleBuyPrompt = async (prompt) => {
    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESS,
        contractABI,
        signer
      );

      const promptPrice = ethers.parseEther(prompt.price);
      console.log("Prompt price:", ethers.formatEther(promptPrice), "HBAR");

      const tx = await contract.buy(prompt.id, {
        value: promptPrice,
      });

      closeModal();
      fetchPrompts();
    } catch (error) {
      console.error("Error buying prompt:", error);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(prompts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPrompts = prompts.slice(startIndex, endIndex);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentPrompts.map((prompt) => (
          <Card
            key={prompt.id}
            className="group relative overflow-hidden transition-all hover:shadow-lg"
          >
            <div className="aspect-video relative overflow-hidden">
              <Image
                src={prompt.imageUrl || "/images/codeguru.png"}
                alt={prompt.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                onError={handleImageError}
              />
              <Badge className="absolute top-2 right-2 z-10">
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
                  <span className="text-sm">{prompt.likes}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Seller: {prompt.owner.slice(0, 6)}...
                </p>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between items-center">
              <span className="text-lg font-bold">{prompt.price} HBAR</span>
              <Button onClick={() => openModal(prompt)}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Buy Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            variant="outline"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
      {/* Prompt Detail Modal */}
      {isModalOpen && selectedPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-lg max-w-xl w-full max-h-[90vh] overflow-auto">
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
                <Image
                  src={selectedPrompt.imageUrl || "/images/codeguru.png"}
                  alt={selectedPrompt.title}
                  width={800}
                  height={450}
                  onError={handleImageError}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center justify-between mb-4">
                <Badge>{selectedPrompt.category}</Badge>
                <div className="flex items-center gap-1 text-yellow-500">
                  <StarIcon className="h-4 w-4 fill-current" />
                  <span>{selectedPrompt.likes}</span>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">
                  {selectedPrompt.description}
                </p>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Seller</h3>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    {selectedPrompt.owner.slice(0, 2)}
                  </div>
                  <span className="font-mono">{selectedPrompt.owner}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">
                  {selectedPrompt.price} HBAR
                </span>
                <Button onClick={() => handleBuyPrompt(selectedPrompt)}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Add prop types if using TypeScript
FetchAllPrompts.defaultProps = {
  selectedCategory: "",
  priceRange: [0, 1000],
  searchQuery: "",
};

export default FetchAllPrompts;
