import cocktailsData from '../data/cocktails.json'

export default function VotePage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Selecciona un Cóctel</h1>
      
      <div className="w-full max-w-screen-lg overflow-x-auto pb-6">
        <div className="flex gap-6 px-4">
          {cocktailsData.cocktails.map((cocktail) => (
            <a 
              key={cocktail.id}
              href={`/vote/${cocktail.id}`}
              className="flex-shrink-0 w-64 bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{cocktail.name}</h2>
              <p className="text-sm text-gray-500">por {cocktail.brand}</p>
            </a>
          ))}
        </div>
      </div>
    </main>
  )
}
