import { Button } from "../components/ui/button"

export default function ThanksPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4">¡Gracias por tu Voto!</h1>
        <p className="text-xl text-gray-600 mb-8">
          Tu opinión es muy importante para nosotros
        </p>
        <Button size="lg" asChild>
          <a href="/vote">Votar Otro Cóctel</a>
        </Button>
      </div>
    </main>
  )
}
