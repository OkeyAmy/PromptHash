import { Button } from "./ui/button"
import { Card, CardContent, CardFooter } from "./ui/card"
import { Badge } from "./ui/badge"
import { StarIcon } from "lucide-react"

const trendingPrompts = [
  {
    id: 1,
    title: "Cyberpunk Character",
    image: "/images/cyberpunk.png",
    price: "0.05 SOL",
    category: "Image",
    rating: 4.8,
  },
  {
    id: 2,
    title: "Fantasy Landscape",
    image: "/images/fantasy.png",
    price: "0.03 SOL",
    category: "Image",
    rating: 4.9,
  },
  {
    id: 3,
    title: "Sci-Fi Story Generator",
    image: "/images/sci-fi.png",
    price: "0.02 SOL",
    category: "Text",
    rating: 4.7,
  },
  {
    id: 4,
    title: "Product Description",
    image: "/images/product-sales.png",
    price: "0.01 SOL",
    category: "Marketing",
    rating: 4.6,
  },
  {
    id: 5,
    title: "React Component Builder",
    image: "/images/react-component.png",
    price: "0.08 SOL",
    category: "Code",
    rating: 4.9,
  },
]

export function TrendingPrompts() {
  return (
    <section className="py-12 px-6 bg-transparent">
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Hot Prompts</h2>
          <Button variant="outline" className="border-gray-700 text-white">
            View all
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {trendingPrompts.map((prompt) => (
            <Card
              key={prompt.id}
              className="bg-gray-900 border-gray-800 overflow-hidden group hover:border-purple-500 transition-all"
            >
              <div className="aspect-[3/2] relative overflow-hidden">
                <img
                  src={prompt.image || "/placeholder.svg"}
                  alt={prompt.title}
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                />
                <Badge className="absolute top-2 right-2 bg-black/60 text-white">{prompt.category}</Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-white truncate">{prompt.title}</h3>
                <div className="flex items-center gap-1 text-yellow-500 mt-1">
                  <StarIcon className="h-4 w-4 fill-current" />
                  <span className="text-sm font-medium">{prompt.rating}</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <span className="text-sm font-bold text-white">{prompt.price}</span>
                <Button size="sm" variant="ghost" className="text-purple-400 hover:text-purple-300 p-0">
                  View
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

