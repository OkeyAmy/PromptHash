import { Navigation } from "../components/navigation"
import { Hero } from "../components/hero"
import { TrendingPrompts } from "../components/trending-prompts"
import { FeaturedPrompts } from "../components/featured-prompts"
import { CategoryShowcase } from "../components/category-showcase"
import { PopularCreators } from "../components/popular-creators"
import { SellerCTA } from "../components/seller-cta"
import { Footer } from "../components/footer"
import { SparklesCore } from "@/components/sparkles"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
      <Navigation />
      <main className="flex-1">
        <Hero />
        <TrendingPrompts />
        <FeaturedPrompts />
        <CategoryShowcase />
        <SellerCTA />
        <PopularCreators />
      </main>
      <Footer />
    </div>
  )
}

