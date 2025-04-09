"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SetupGuide() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2">FurniCraft Setup Guide</h1>
      <p className="text-gray-600 mb-8">Follow these steps to set up and run the FurniCraft project in VS Code</p>

      <Tabs defaultValue="setup" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="setup">Initial Setup</TabsTrigger>
          <TabsTrigger value="structure">Project Structure</TabsTrigger>
          <TabsTrigger value="run">Running the App</TabsTrigger>
          <TabsTrigger value="deploy">Deployment</TabsTrigger>
        </TabsList>

        <TabsContent value="setup">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Step 1: Install Prerequisites</CardTitle>
                <CardDescription>Make sure you have the following installed on your system</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Node.js (v18.0.0 or higher) -{" "}
                    <a
                      href="https://nodejs.org"
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </a>
                  </li>
                  <li>npm (v9.0.0 or higher) or yarn (v1.22.0 or higher)</li>
                  <li>
                    Visual Studio Code -{" "}
                    <a
                      href="https://code.visualstudio.com"
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Step 2: Create a New Next.js Project</CardTitle>
                <CardDescription>Open your terminal and run the following commands</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-900 text-white p-4 rounded-md relative">
                    <pre className="font-mono text-sm overflow-x-auto">
                      <code>npx create-next-app@latest furnicraft --typescript --eslint --tailwind --app</code>
                    </pre>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white"
                      onClick={() =>
                        copyToClipboard(
                          "npx create-next-app@latest furnicraft --typescript --eslint --tailwind --app",
                          "create-next-app",
                        )
                      }
                    >
                      {copied === "create-next-app" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p>
                    This will create a new Next.js project with TypeScript, ESLint, Tailwind CSS, and the App Router.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Step 3: Navigate to the Project Directory</CardTitle>
                <CardDescription>Change to the project directory and open it in VS Code</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-900 text-white p-4 rounded-md relative">
                    <pre className="font-mono text-sm overflow-x-auto">
                      <code>cd furnicraft code .</code>
                    </pre>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white"
                      onClick={() => copyToClipboard("cd furnicraft\ncode .", "navigate")}
                    >
                      {copied === "navigate" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Step 4: Install Required Dependencies</CardTitle>
                <CardDescription>Install the necessary packages for the project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-900 text-white p-4 rounded-md relative">
                    <pre className="font-mono text-sm overflow-x-auto">
                      <code>
                        npm install @react-three/fiber @react-three/drei three @types/three npm install
                        @radix-ui/react-dialog @radix-ui/react-label @radix-ui/react-slider @radix-ui/react-tabs npm
                        install lucide-react npm install class-variance-authority clsx tailwind-merge
                      </code>
                    </pre>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white"
                      onClick={() =>
                        copyToClipboard(
                          "npm install @react-three/fiber @react-three/drei three @types/three\nnpm install @radix-ui/react-dialog @radix-ui/react-label @radix-ui/react-slider @radix-ui/react-tabs\nnpm install lucide-react\nnpm install class-variance-authority clsx tailwind-merge",
                          "install-deps",
                        )
                      }
                    >
                      {copied === "install-deps" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p>These packages include:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>React Three Fiber and Drei for 3D rendering</li>
                    <li>Radix UI components for accessible UI elements</li>
                    <li>Lucide React for icons</li>
                    <li>Utility libraries for Tailwind CSS</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Step 5: Create Models Directory</CardTitle>
                <CardDescription>Create a directory for 3D models</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-900 text-white p-4 rounded-md relative">
                    <pre className="font-mono text-sm overflow-x-auto">
                      <code>mkdir -p public/models</code>
                    </pre>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white"
                      onClick={() => copyToClipboard("mkdir -p public/models", "mkdir")}
                    >
                      {copied === "mkdir" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p>You'll need to add 3D model files (GLB format) to this directory for the furniture items.</p>
                  <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-yellow-800 text-sm">
                      <strong>Note:</strong> The current implementation uses built-in Three.js geometries instead of
                      external 3D models. If you want to use custom 3D models, you'll need to:
                    </p>
                    <ol className="list-decimal pl-6 mt-2 text-sm text-yellow-800">
                      <li>Add GLB files to the public/models directory</li>
                      <li>Modify the furniture-item.tsx component to use useGLTF from drei</li>
                      <li>Handle model loading and error states properly</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="structure">
          <Card>
            <CardHeader>
              <CardTitle>Project Structure</CardTitle>
              <CardDescription>Here's how the project files should be organized</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-white p-4 rounded-md font-mono text-sm overflow-x-auto">
                <pre>
                  {`furnicraft/
├── app/
│   ├── about/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   ├── gallery/
│   │   └── page.tsx
│   ├── products/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── slider.tsx
│   │   ├── tabs.tsx
│   │   └── textarea.tsx
│   ├── color-picker.tsx
│   ├── floor-texture.tsx
│   ├── floor-texture-selector.tsx
│   ├── furniture-controls.tsx
│   ├── furniture-item.tsx
│   ├── login-form.tsx
│   ├── navbar.tsx
│   ├── room.tsx
│   └── setup-guide.tsx
├── hooks/
│   └── use-toast.ts
├── lib/
│   └── utils.ts
├── public/
│   └── models/
│       ├── chair.glb
│   ├── lamp.glb
│   ├── sofa.glb
│   └── table.glb
├── .eslintrc.json
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── tsconfig.json`}
                </pre>
              </div>
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-medium">Key Directories:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>app/</strong> - Contains the main pages and layouts using Next.js App Router
                  </li>
                  <li>
                    <strong>components/</strong> - Reusable React components
                  </li>
                  <li>
                    <strong>components/ui/</strong> - UI components based on shadcn/ui
                  </li>
                  <li>
                    <strong>hooks/</strong> - Custom React hooks
                  </li>
                  <li>
                    <strong>lib/</strong> - Utility functions
                  </li>
                  <li>
                    <strong>public/models/</strong> - 3D model files for furniture
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="run">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Running the Development Server</CardTitle>
                <CardDescription>Start the Next.js development server</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-900 text-white p-4 rounded-md relative">
                    <pre className="font-mono text-sm overflow-x-auto">
                      <code>npm run dev</code>
                    </pre>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white"
                      onClick={() => copyToClipboard("npm run dev", "run-dev")}
                    >
                      {copied === "run-dev" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p>
                    This will start the development server at{" "}
                    <code className="bg-gray-100 px-1 py-0.5 rounded">http://localhost:3000</code>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>VS Code Extensions</CardTitle>
                <CardDescription>Recommended extensions for better development experience</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>ESLint</strong> - For code linting
                  </li>
                  <li>
                    <strong>Prettier</strong> - For code formatting
                  </li>
                  <li>
                    <strong>Tailwind CSS IntelliSense</strong> - For Tailwind CSS class suggestions
                  </li>
                  <li>
                    <strong>JavaScript and TypeScript Nightly</strong> - For better TypeScript support
                  </li>
                  <li>
                    <strong>glTF Tools</strong> - For working with 3D models
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Debugging in VS Code</CardTitle>
                <CardDescription>Set up debugging for Next.js in VS Code</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>
                    Create a <code className="bg-gray-100 px-1 py-0.5 rounded">.vscode/launch.json</code> file with the
                    following content:
                  </p>
                  <div className="bg-gray-900 text-white p-4 rounded-md relative">
                    <pre className="font-mono text-sm overflow-x-auto">
                      <code>{`{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    },
    {
      "name": "Next.js: debug full stack",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev",
      "serverReadyAction": {
        "pattern": "started server on .+, url: (https?://.+)",
        "uriFormat": "%s",
        "action": "debugWithChrome"
      }
    }
  ]
}`}</code>
                    </pre>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white"
                      onClick={() =>
                        copyToClipboard(
                          `{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    },
    {
      "name": "Next.js: debug full stack",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev",
      "serverReadyAction": {
        "pattern": "started server on .+, url: (https?://.+)",
        "uriFormat": "%s",
        "action": "debugWithChrome"
      }
    }
  ]
}`,
                          "debug-config",
                        )
                      }
                    >
                      {copied === "debug-config" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p>Now you can debug your application by pressing F5 or using the Run and Debug panel in VS Code.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="deploy">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Building for Production</CardTitle>
                <CardDescription>Create an optimized production build</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-900 text-white p-4 rounded-md relative">
                    <pre className="font-mono text-sm overflow-x-auto">
                      <code>npm run build</code>
                    </pre>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white"
                      onClick={() => copyToClipboard("npm run build", "build")}
                    >
                      {copied === "build" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p>
                    This will create an optimized production build in the{" "}
                    <code className="bg-gray-100 px-1 py-0.5 rounded">.next</code> directory.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Running in Production Mode</CardTitle>
                <CardDescription>Start the production server locally</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-900 text-white p-4 rounded-md relative">
                    <pre className="font-mono text-sm overflow-x-auto">
                      <code>npm start</code>
                    </pre>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white"
                      onClick={() => copyToClipboard("npm start", "start")}
                    >
                      {copied === "start" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p>
                    This will start the production server at{" "}
                    <code className="bg-gray-100 px-1 py-0.5 rounded">http://localhost:3000</code>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Deploying to Vercel</CardTitle>
                <CardDescription>Deploy your application to Vercel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>The easiest way to deploy your Next.js app is to use the Vercel Platform.</p>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Push your code to a Git repository (GitHub, GitLab, or Bitbucket)</li>
                    <li>
                      Import your repository on Vercel:{" "}
                      <a
                        href="https://vercel.com/import"
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        https://vercel.com/import
                      </a>
                    </li>
                    <li>Vercel will detect that you're using Next.js and set up the build configuration for you</li>
                    <li>Click "Deploy" and your application will be live in minutes</li>
                  </ol>
                  <div className="bg-gray-900 text-white p-4 rounded-md relative">
                    <pre className="font-mono text-sm overflow-x-auto">
                      <code>npm install -g vercel vercel</code>
                    </pre>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white"
                      onClick={() => copyToClipboard("npm install -g vercel\nvercel", "vercel")}
                    >
                      {copied === "vercel" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p>Alternatively, you can use the Vercel CLI to deploy directly from your terminal.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
