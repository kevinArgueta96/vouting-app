import { Button } from "./components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col gap-4">
        <h1 className="text-4xl font-bold mb-4">Hello World</h1>
        <Button size="lg">Welcome to Next.js</Button>
      </div>
    </main>
  )
}
