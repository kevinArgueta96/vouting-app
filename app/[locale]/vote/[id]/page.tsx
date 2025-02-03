import CocktailVotePage from './cocktail-vote-page';

interface PageProps {
  params: Promise<{ id: string }>; // ✅ Define params as a Promise
}

export default async function VoteDetailPage({ params }: PageProps) {
  const resolvedParams = await params; // ✅ Await params to resolve the Promise
  const { id } = resolvedParams;

  return <CocktailVotePage id={id} />;
}