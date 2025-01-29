import { Button } from "./components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6 relative">
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4 text-center">¡Bienvenido!</h1>
        <p className="text-xl text-center text-gray-600 mb-8">
          Ayúdanos a elegir los mejores cócteles
        </p>
      </div>
      <div className="w-full max-w-md mb-8">
        <Button size="lg" className="w-full py-6" asChild>
          <a href="/vote">Comenzar a Votar</a>
        </Button>
      </div>
    </main>
  )
}
