import { useState, ChangeEvent, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertCircle, DollarSign } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ethers } from "ethers";

interface FormData {
  image: string;
  title: string;
  content: string;
  category: string;
  price: string;
  rating: string;
}

export function CreatePromptForm() {
  const [formData, setFormData] = useState<FormData>({
    image: "",
    title: "",
    content: "",
    category: "",
    price: "3",
    rating: "3",
  });

  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [account, setAccount] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.image.trim()) newErrors.image = "Image URL is required";
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (formData.title.length < 3)
      newErrors.title = "Title must be at least 3 characters";
    if (!formData.content.trim()) newErrors.content = "Content is required";
    if (formData.content.length < 10)
      newErrors.content = "Content must be at least 10 characters";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      newErrors.price = "Price must be a positive number";
    }
    if (!formData.rating) newErrors.rating = "Rating is required";
    if (Number(formData.rating) < 1 || Number(formData.rating) > 5) {
      newErrors.rating = "Rating must be between 1 and 5";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // get the user wallet address
    if (!window.ethereum) {
      alert("MetaMask not installed");
      return;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const network = await provider.getNetwork();
    console.log("Connected Network:", Number(network.chainId));
    const address = await signer.getAddress();
    if (!address || address == null) {
      alert("connect wallet before proceeding");
      return;
    }
    setAccount(address);
    // validate form and submit
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const response = await fetch("/api/prompts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: formData.image,
            title: formData.title,
            content: formData.content,
            category: formData.category,
            price: Number(formData.price),
            rating: Number(formData.rating),
            walletAddress: account,
            // Note: owner will be set by the API based on the connected wallet address
          }),
        });

        const data = await response.json();
        console.log("API Response:", data);

        if (!response.ok) {
          throw new Error(data.error || "Failed to create prompt");
        }

        // Reset form after successful submission
        setFormData({
          image: "",
          title: "",
          content: "",
          category: "",
          price: "",
          rating: "1",
        });
        alert("Prompt submitted successfully!");
      } catch (error: any) {
        console.error("Error submitting prompt:", error);
        alert(error.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Image URL</label>
          <Input
            placeholder="Enter image URL"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className={errors.image ? "border-red-500" : "border-purple-400"}
          />
          {errors.image && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.image}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <Input
            placeholder="Enter prompt title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? "border-red-500" : "border-purple-400"}
          />
          {errors.title && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.title}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Content</label>
        <Textarea
          placeholder="Enter prompt content..."
          name="content"
          value={formData.content}
          onChange={handleChange}
          className={errors.content ? "border-red-500" : "border-purple-400"}
          rows={4}
        />
        {errors.content && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.content}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select
            value={formData.category}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger
              className={
                errors.category ? "border-red-500" : "border-purple-400"
              }
            >
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Creative Writing">Creative Writing</SelectItem>
              <SelectItem value="Programming">Programming</SelectItem>
              <SelectItem value="Music">Music</SelectItem>
              <SelectItem value="Gaming">Gaming</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.category}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Price (HBAR)</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              placeholder="0.00"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="1"
              min={1}
              max={1000}
              className={`pl-9 ${
                errors.price ? "border-red-500" : "border-purple-400"
              }`}
            />
          </div>
          {errors.price && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.price}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Rating (1-5)</label>
        <Input
          type="number"
          placeholder="1"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          min="1"
          max="5"
          className={errors.rating ? "border-red-500" : "border-purple-400"}
        />
        {errors.rating && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.rating}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Prompt"}
      </Button>
    </form>
  );
}
