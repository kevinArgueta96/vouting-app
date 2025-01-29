import CocktailVotePage from './cocktail-vote-page'

interface Props {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function Page({ params }: Props) {
  return <CocktailVotePage id={params.id} />
}
