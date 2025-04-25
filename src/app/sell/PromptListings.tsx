import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface Prompt {
  _id: string;
  title: string;
  content: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  owner: {
    username: string;
    walletAddress: string;
  };
  createdAt: string;
}

export function PromptListings() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserPrompts();
  }, []);

  const fetchUserPrompts = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask not installed");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      if (!address) {
        throw new Error("Please connect your wallet first");
      }

      // Fetch prompts for the connected wallet
      const response = await fetch(`/api/prompts?walletAddress=${address}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch prompts");
      }

      setPrompts(data);
    } catch (error: any) {
      console.error("Error fetching prompts:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  if (prompts.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        No prompts found. Start by creating a new prompt!
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {prompts.map((prompt) => (
        <Card key={prompt._id}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/4">
                <img
                  src={prompt.image}
                  alt={prompt.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold">{prompt.title}</h3>
                  <Badge className="bg-purple-500">
                    Rating: {prompt.rating}/5
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2 mb-4">
                  {prompt.content}
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    {prompt.category}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Price:</span>
                    {prompt.price} HBAR
                  </div>
                  <div>
                    <span className="text-muted-foreground">Created:</span>
                    {new Date(prompt.createdAt).toLocaleDateString()}
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
  );
}
