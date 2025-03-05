import { Button } from "./ui/button"
import Link from "next/link"

export function SellerCTA() {
  return (
    <section className="py-16 px-6 bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>
      <div className="mx-auto max-w-7xl relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-4">Sell your prompts on PromptHub</h2>
            <p className="text-lg text-gray-300 mb-6">
              Join thousands of creators who earn by selling their AI prompts. Turn your expertise into income.
            </p>
            <Link href="/sell">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                Start Selling
              </Button>
            </Link>
          </div>
          <div className="w-full max-w-md">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-400">Monthly Revenue</div>
                <div className="text-sm text-green-400">+24%</div>
              </div>
              <div className="h-32 w-full relative">
                <div className="absolute bottom-0 left-0 w-full h-full flex items-end">
                  {[40, 65, 30, 85, 50, 75, 90].map((height, i) => (
                    <div
                      key={i}
                      className="w-1/7 mx-0.5 bg-gradient-to-t from-purple-600 to-blue-500 rounded-t"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

