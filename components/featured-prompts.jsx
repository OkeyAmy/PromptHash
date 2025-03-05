import { Button } from "./ui/button"
import { Card, CardContent, CardFooter } from "./ui/card"
import { Badge } from "./ui/badge"
import { StarIcon } from "lucide-react"

const featuredPrompts = [
  {
    id: 1,
    title: "Creative Story Generator",
    description: "Generate engaging short stories with complex characters and plot twists.",
    image: "/placeholder.svg?height=200&width=300",
    price: "0.1 SOL",
    category: "Creative Writing",
    rating: 4.8,
  },
  {
    id: 2,
    title: "SEO Content Optimizer",
    description: "Create SEO-optimized content that ranks well on search engines.",
    image: "/placeholder.svg?height=200&width=300",
    price: "0.08 SOL",
    category: "Marketing",
    rating: 4.9,
  },
  {
    id: 3,
    title: "Code Refactoring Assistant",
    description: "Improve your code quality with smart refactoring suggestions.",
    image: "/placeholder.svg?height=200&width=300",
    price: "0.15 SOL",
    category: "Programming",
    rating: 4.7,
  },
]

export function FeaturedPrompts() {
  return (
    <section className="py-16 px-6 bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-white">Featured Prompts</h2>
          <Button variant="outline" className="border-gray-700 text-white">
            View all
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredPrompts.map((prompt) => (
            <Card
              key={prompt.id}
              className="bg-gray-800 border-gray-700 overflow-hidden group hover:border-purple-500 transition-all"
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={prompt.image || "/placeholder.svg"}
                  alt={prompt.title}
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                />
                <Badge className="absolute top-2 right-2 bg-black/60 text-white">{prompt.category}</Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-white">{prompt.title}</h3>
                <p className="mt-2 text-sm text-gray-300 line-clamp-2">{prompt.description}</p>
                <div className="flex items-center gap-1 text-yellow-500 mt-3">
                  <StarIcon className="h-4 w-4 fill-current" />
                  <span className="text-sm font-medium">{prompt.rating}</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <span className="text-lg font-bold text-white">{prompt.price}</span>
                <Button className="bg-purple-600 hover:bg-purple-700">Buy Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

