"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useKeenSlider } from "keen-slider/react"
import { useInView } from "react-intersection-observer"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Image from "next/image"
import "keen-slider/keen-slider.min.css"


const featuredProducts = [
  { id: 1, name: "Modern Sofa", image: "/images/products/modern_sofa.jpg" },
  { id: 2, name: "Dining Table", image: "/images/products/dining_table.jpg" },
  { id: 3, name: "Accent Chair", image: "/images/products/office_chair.jpg" },
  { id: 4, name: "Bed Side Lamp", image: "/images/products/bedside_lamp.jpg" },
]

export default function HomePage() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const { ref: featureRef, inView: featureInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  
  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
    created() {
      setLoaded(true)
    },
    loop: true,
    slides: { perView: 1 },
  })

  useEffect(() => {
    const interval = setInterval(() => {
      if (instanceRef.current) {
        instanceRef.current.next()
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [instanceRef])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 flex flex-col">
      <Navbar
        isLoggedIn={false}
        userRole={null}
        onLoginClick={() => {}}
        onLogout={() => {}}
        activePage="home"
      />

      {/* Hero Section */}
      <section className="relative h-[80vh] w-full overflow-hidden">
        <div ref={sliderRef} className="keen-slider h-full w-full">
          <div className="keen-slider__slide relative">
            <div className="absolute inset-0 bg-black/40 z-10" />
            <div className="h-full w-full bg-[url('/images/hero/hero2.jpg')] bg-cover bg-center" />
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <div className="text-center max-w-3xl px-6">
                <motion.h1 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-5xl md:text-6xl font-bold text-white mb-6"
                >
                  Transform Your Space
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-xl text-white/90 mb-8"
                >
                  Design your dream interior with our intuitive 2D & 3D furniture configurators
                </motion.p>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <Button 
                    size="lg" 
                    className="bg-amber-500 hover:bg-amber-600 text-lg px-8 py-6 rounded-full shadow-lg mr-4"
                    onClick={() => router.push("/3d")}
                  >
                    Start Designing
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="bg-transparent border-white text-white hover:bg-white/20 text-lg px-8 py-6 rounded-full"
                    onClick={() => router.push("/gallery")}
                  >
                    View Gallery
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
          <div className="keen-slider__slide relative">
            <div className="absolute inset-0 bg-black/40 z-10" />
            <div className="h-full w-full bg-[url('/images/hero/hero1.jpg')] bg-cover bg-center" />
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <div className="text-center max-w-3xl px-6">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Customize Your Furniture</h1>
                <p className="text-xl text-white/90 mb-8">Change colors, materials, and dimensions to match your exact style</p>
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 rounded-full shadow-lg"
                  onClick={() => router.push("/products")}
                >
                  Browse Products
                </Button>
              </div>
            </div>
          </div>
        </div>

        {loaded && instanceRef.current && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center z-30">
            {[...Array(instanceRef.current.track.details.slides.length)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                className={`w-3 h-3 rounded-full mx-1 ${currentSlide === idx ? 'bg-white' : 'bg-white/50'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </section>

     
      <section className="py-20 px-4 md:px-8 container mx-auto">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Design Tools
          </motion.h2>
          <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect tool for your furniture design project
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="h-56 bg-amber-50 flex items-center justify-center p-6">
              <div className="relative w-full h-full">
                <Image 
                  src="/images/hero/2Dhero.jpg" 
                  alt="2D Designer" 
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-4">2D Designer</h3>
              <p className="text-gray-600 mb-6">
                Upload your room photo and see how furniture fits in your actual space. Perfect for visualizing your ideas before making a purchase.
              </p>
              <Button 
                className="w-full bg-amber-600 hover:bg-amber-700" 
                onClick={() => router.push("/canvas")}
              >
                Try 2D Designer
              </Button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="h-56 bg-blue-50 flex items-center justify-center p-6">
              <div className="relative w-full h-full">
                <Image 
                  src="/images/hero/3Dhero.jpg" 
                  alt="3D Designer" 
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-4">3D Designer</h3>
              <p className="text-gray-600 mb-6">
                Create immersive 3D layouts with precise measurements and realistic textures. Rotate, resize, and customize every detail of your furniture.
              </p>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700" 
                onClick={() => router.push("/3d")}
              >
                Try 3D Designer
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-neutral-900 text-white">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4">
              Featured Products
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-gray-300 max-w-2xl mx-auto">
              Browse our curated selection of high-quality furniture
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, i) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative group cursor-pointer"
                onClick={() => router.push(`/products/${product.id}`)}
              >
                <div className="h-80 overflow-hidden rounded-lg">
                  <div className="relative h-full w-full">
                    <Image 
                      src={product.image} 
                      alt={product.name} 
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                      <Button className="bg-white text-black hover:bg-white/90" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-neutral-100"
              onClick={() => router.push("/products")}
            >
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section ref={featureRef} className="py-20 px-4 md:px-8 container mx-auto">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={featureInView ? "visible" : "hidden"}
          className="text-center mb-12"
        >
          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose FurniCraft?
          </motion.h2>
          <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore the features that make our design platform unique
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "🏠",
              title: "Room Visualization",
              description: "Upload your own room photos for a personalized design experience that shows how furniture will look in your actual space."
            },
            {
              icon: "🎨",
              title: "Unlimited Customization",
              description: "Change colors, materials, dimensions, and placement with our intuitive controls for the perfect fit."
            },
            {
              icon: "💾",
              title: "Save & Share",
              description: "Save your designs, export high-quality renders, and easily share with friends and family for feedback."
            },
            {
              icon: "🔍",
              title: "Precise Dimensions",
              description: "Ensure furniture fits perfectly with accurate measurements and scaling tools."
            },
            {
              icon: "🏆",
              title: "Premium Quality",
              description: "All products in our catalog are carefully selected for quality, durability, and style."
            },
            {
              icon: "💡",
              title: "Design Inspiration",
              description: "Browse our gallery of professionally designed spaces to spark ideas for your own home."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-amber-500 to-amber-700">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-white"
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Design Your Dream Space?</h2>
            <p className="text-xl mb-8">Start creating beautiful interiors with our powerful design tools</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-amber-700 hover:bg-neutral-100 text-lg px-8"
                onClick={() => router.push("/3d")}
              >
                Start Designing Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/20 text-lg px-8"
                onClick={() => router.push("/setup")}
              >
                View Setup Guide
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">FurniCraft</h3>
              <p className="text-gray-400">Transform your space with our innovative furniture design tools.</p>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Tools</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white" onClick={() => router.push("/canvas")}>2D Designer</button></li>
                <li><button className="hover:text-white" onClick={() => router.push("/3d")}>3D Designer</button></li>
                <li><button className="hover:text-white" onClick={() => router.push("/setup")}>Setup Guide</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Products</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white" onClick={() => router.push("/products")}>All Products</button></li>
                <li><button className="hover:text-white" onClick={() => router.push("/products/living")}>Living Room</button></li>
                <li><button className="hover:text-white" onClick={() => router.push("/products/dining")}>Dining</button></li>
                <li><button className="hover:text-white" onClick={() => router.push("/products/bedroom")}>Bedroom</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white" onClick={() => router.push("/about")}>About Us</button></li>
                <li><button className="hover:text-white" onClick={() => router.push("/contact")}>Contact</button></li>
                <li><button className="hover:text-white" onClick={() => router.push("/support")}>Support</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} FurniCraft. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}