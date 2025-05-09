"use client"

import { useState, useRef } from "react"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"

export default function UploadFurniturePage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [model, setModel] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const imageInputRef = useRef<HTMLInputElement>(null)
  const modelInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setModel(file)
    }
  }

  const handleUpload = () => {
    // Simulate upload logic (integration with backend required for real use)
    alert("Furniture uploaded! (Simulated)")
    router.push("/3d")
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar isLoggedIn={true} userRole="admin" onLoginClick={() => {}} onLogout={() => {}} activePage="3d" />
      <main className="flex-1 flex flex-col items-center justify-center py-8">
        <div className="bg-gray-200 rounded-lg shadow-lg p-8 w-full max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Upload Furniture</h1>
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-4">
              <div>
                <Label>Furniture Name</Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Enter furniture name" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Enter description" />
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <Label>Furniture Image</Label>
                <div className="border rounded bg-gray-300 h-28 flex items-center justify-center cursor-pointer" onClick={() => imageInputRef.current?.click()}>
                  {imagePreview ? <img src={imagePreview} alt="Preview" className="h-full object-contain" /> : <span className="text-gray-500">Click to select image</span>}
                </div>
                <input type="file" accept="image/*" ref={imageInputRef} className="hidden" onChange={handleImageChange} />
              </div>
              <div>
                <Label>Furniture Model 3D (GLB)</Label>
                <div className="border rounded bg-gray-300 h-28 flex items-center justify-center cursor-pointer" onClick={() => modelInputRef.current?.click()}>
                  {model ? <span className="text-green-700">{model.name}</span> : <span className="text-gray-500">Click to select .glb file</span>}
                </div>
                <input type="file" accept=".glb" ref={modelInputRef} className="hidden" onChange={handleModelChange} />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-8">
            <Button onClick={handleUpload} disabled={!name || !model || !image || !description}>Upload</Button>
          </div>
        </div>
      </main>
    </div>
  )
} 