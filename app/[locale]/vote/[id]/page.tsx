import CocktailVotePage from './cocktail-vote-page'

export default async function VoteDetailPage({
  params
}: {
  params: { id: string }
}) {
  const id = (await params).id
  return <CocktailVotePage id={id} />
}
