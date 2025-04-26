"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Eye, StarIcon } from "lucide-react";
import Image from "next/image";

// Define interfaces for type safety
interface Prompt {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  price: string;
  likes: string;
  owner: string;
  exists: boolean;
  onSale: boolean;
}

const contractABI = [
  {
    inputs: [{ type: "address", name: "user" }],
    name: "getUserPrompts",
    outputs: [{ type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ type: "uint256" }],
    name: "prompts",
    outputs: [
      { name: "title", type: "string" },
      { name: "description", type: "string" },
      { name: "category", type: "string" },
      { name: "imageUrl", type: "string" },
      { name: "price", type: "uint256" },
      { name: "likes", type: "uint256" },
      { name: "owner", type: "address" },
      { name: "exists", type: "bool" },
      { name: "onSale", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const MyPrompts = () => {
  const [userPrompts, setUserPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchUserPrompts();
  }, []);

  const fetchUserPrompts = async () => {
    try {
      setIsLoading(true);

      if (!window.ethereum) {
        throw new Error("Please install MetaMask");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      const contractAddress = process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESS;
      if (!contractAddress) {
        throw new Error("Contract address not found");
      }

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );

      const promptIds = await contract.getUserPrompts(userAddress);

      const promptsData = await Promise.all(
        promptIds.map(async (id: bigint) => {
          const prompt = await contract.prompts(id);
          return {
            id: id.toString(),
            title: prompt[0],
            description: prompt[1],
            category: prompt[2],
            imageUrl: prompt[3],
            price: ethers.formatEther(prompt[4]),
            likes: prompt[5].toString(),
            owner: prompt[6],
            exists: prompt[7],
            onSale: prompt[8],
          } as Prompt;
        })
      );

      setUserPrompts(promptsData);
    } catch (error) {
      console.error("Error fetching user prompts:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPrompt(null);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = "/images/codeguru.png";
    target.onerror = null;
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
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">My Prompts</h1>

      {userPrompts.length === 0 ? (
        <div className="text-center text-gray-500 p-4">
          You don't own any prompts yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {userPrompts.map((prompt) => (
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
                  <Badge variant={prompt.onSale ? "default" : "secondary"}>
                    {prompt.onSale ? "For Sale" : "Not for Sale"}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <span className="text-lg font-bold">
                  {Number(prompt.price) / 1e18} HBAR
                </span>
                <Button onClick={() => openModal(prompt)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Edit Prompt
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

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

              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">
                  {Number(selectedPrompt.price) / 1e18} HBAR
                </span>
                <div className="space-x-2">
                  <Button
                    variant={selectedPrompt.onSale ? "destructive" : "default"}
                  >
                    {selectedPrompt.onSale
                      ? "Remove from Sale"
                      : "List for Sale"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPrompts;
