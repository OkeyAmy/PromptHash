"use client"

import { Navigation } from "../../components/navigation"
import { Footer } from "../../components/footer"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent, CardFooter } from "../../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Slider } from "../../components/ui/slider"
import { Badge } from "../../components/ui/badge"
import { StarIcon, Filter } from "lucide-react"
import { useState } from "react"

const prompts = [
  {
    id: 1,
    title: "Creative Story Generator",
    description: "Generate engaging short stories with complex characters and plot twists.",
    image: "/placeholder.svg?height=200&width=300",
    price: 0.1,
    category: "Creative Writing",
    rating: 4.8,
    seller: "Alice.eth",
  },
  // Add more prompts...
]

export default function BrowsePage() {
  const [priceRange, setPriceRange] = useState([0, 1])

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
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
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="creative">Creative Writing</SelectItem>
                    <SelectItem value="coding">Coding</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Price Range (ETH)</label>
                <Slider value={priceRange} onValueChange={setPriceRange} max={1} step={0.01} />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{priceRange[0]} ETH</span>
                  <span>{priceRange[1]} ETH</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <Select defaultValue="recent">
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </aside>

          {/* Prompts Grid */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-4">
              <Input placeholder="Search prompts..." className="max-w-md bg-gray-800 border-gray-700" />
              <Button className="bg-purple-600 hover:bg-purple-700">Search</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prompts.map((prompt) => (
                <Card key={prompt.id} className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-all">
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={prompt.image || "/placeholder.svg"}
                      alt={prompt.title}
                      className="object-cover w-full h-full transition-transform group-hover:scale-105"
                    />
                    <Badge className="absolute top-2 right-2 bg-black/60 text-white">{prompt.category}</Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-white">{prompt.title}</h3>
                    <p className="text-sm text-gray-300 mt-1 line-clamp-2">{prompt.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <StarIcon className="h-4 w-4 fill-current" />
                        <span className="text-sm">{prompt.rating}</span>
                      </div>
                      <p className="text-sm text-gray-400">Seller: {prompt.seller}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between items-center">
                    <span className="text-lg font-bold text-white">{prompt.price} ETH</span>
                    <Button className="bg-purple-600 hover:bg-purple-700">View Details</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

