"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function AboutPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<"user" | "admin" | null>(null)
  const [showLogin, setShowLogin] = useState(false)

  // Move localStorage access to useEffect to ensure it only runs on the client
  useEffect(() => {
    // Check localStorage for login state
    const storedUser = localStorage.getItem("furnicraft_user")
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        setIsLoggedIn(true)
        setUserRole(user.role)
      } catch (e) {
        // Handle potential JSON parse error
        console.error("Error parsing user data from localStorage", e)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("furnicraft_user")
    setIsLoggedIn(false)
    setUserRole(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        onLoginClick={() => setShowLogin(true)}
        onLogout={handleLogout}
        activePage="about"
      />

      <main className="flex-1 container mx-auto px-4 py-8">
        <section className="mb-16">
          <h1 className="text-4xl font-bold mb-4">About FurniCraft</h1>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <p className="text-lg mb-4">
                Founded in 2010, FurniCraft has been at the forefront of innovative furniture design and customization.
                Our mission is to empower customers to create spaces that truly reflect their personality and needs.
              </p>
              <p className="text-lg mb-4">
                What started as a small workshop has grown into a leading platform for furniture customization,
                combining traditional craftsmanship with cutting-edge technology.
              </p>
              <p className="text-lg">
                We believe that furniture should be as unique as the people who use it, which is why we've developed our
                state-of-the-art 3D configurator to help you visualize and create your perfect space.
              </p>
            </div>
            <div className="md:w-1/2">
              <img src="/images/about/workshop.jpg" alt="FurniCraft workshop" className="rounded-lg shadow-lg w-full" />
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-gray-600">
                We constantly push the boundaries of what's possible in furniture design and customization technology.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Customer Focus</h3>
              <p className="text-gray-600">
                Everything we do is centered around empowering our customers to create their ideal living spaces.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h.5A2.5 2.5 0 0020 5.5v-1.5"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Sustainability</h3>
              <p className="text-gray-600">
                We're committed to environmentally responsible practices in our materials and manufacturing processes.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Dinitha Wickramasinghe", image: "/images/about/team/dinitha.jpg" },
              { name: "Ranawaka Perera", image: "/images/about/team/ranawaka.jpg" },
              { name: "Mohammed Umair", image: "/images/about/team/umair.jpg" },
              { name: "Kenula Andradi", image: "/images/about/team/kenula.jpg" },
              { name: "Roshane Perera", image: "/images/about/team/roshane.jpg" },
              { name: "Mathew Lakruwan", image: "/images/about/team/mathew.jpg" },
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md text-center">
                <img src={member.image || "/placeholder.svg"} alt={member.name} className="w-full h-64 object-cover" />
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-12 text-center">
          <Button size="lg" className="bg-amber-600 hover:bg-amber-700" onClick={() => router.push("/")}>
            Try Our Furniture Configurator
          </Button>
        </div>
      </main>
    </div>
  )
}