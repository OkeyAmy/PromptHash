import { Button } from "./ui/button"
import Link from "next/link"

export function Hero() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
            AI Prompt Marketplace
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Explore the best prompts from top creators. Generate images, text & code with ease.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/browse">
              <Button size="lg" className="rounded-full bg-purple-600 hover:bg-purple-700">
                Explore Prompts
              </Button>
            </Link>
            <div className="flex items-center space-x-1">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="inline-block h-6 w-6 rounded-full bg-gray-700 ring-2 ring-gray-900" />
                ))}
              </div>
              <div className="text-sm text-gray-400">
                <span className="font-semibold text-white">4.9★</span> (2.5k+ reviews)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

