"use client"

import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar
        isLoggedIn={false}
        userRole={null}
        onLoginClick={() => {}}
        onLogout={() => {}}
        activePage="home"
      />
      <main className="flex-1 container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <h1 className="text-5xl font-bold mb-6">Welcome to FurniCraft</h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl">
          Design, visualize, and customize your dream space with our powerful 2D and 3D furniture configurators. Browse our product catalog, get inspired by our gallery, and bring your ideas to life!
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
          <Button size="lg" className="bg-amber-600 hover:bg-amber-700" onClick={() => router.push("/canvas")}>2D Designer</Button>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push("/3d")}>3D Designer</Button>
          <Button size="lg" variant="outline" onClick={() => router.push("/products")}>Products</Button>
          <Button size="lg" variant="outline" onClick={() => router.push("/gallery")}>Gallery</Button>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-2">Why FurniCraft?</h2>
          <ul className="text-lg text-gray-700 space-y-2">
            <li>✔️ Upload your own room photo for personalized design</li>
            <li>✔️ Realistic 2D and 3D furniture visualization</li>
            <li>✔️ Easy color, scale, and rotation controls</li>
            <li>✔️ Save, export, and share your designs</li>
            <li>✔️ Explore curated products and design inspirations</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
