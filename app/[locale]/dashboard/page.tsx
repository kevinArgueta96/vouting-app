'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { cocktailService, ratingService } from '@/app/services/supabase';
import { PieChart } from '@/app/components/ui/pie-chart';
import { BarChart } from '@/app/components/ui/bar-chart';
import { StatCard } from '@/app/components/ui/stat-card';

interface CocktailWithStats {
  id: number;
  name: string;
  brand: string;
  totalVotes: number;
  averageAppearance: number;
  averageTaste: number;
  averageInnovativeness: number;
  averageOverall: number;
}

type SortField = 'name' | 'brand' | 'totalVotes' | 'averageAppearance' | 'averageTaste' | 'averageInnovativeness' | 'averageOverall';
type SortDirection = 'asc' | 'desc';

export default function DashboardPage() {
  const t = useTranslations('Dashboard');
  const locale = useLocale();
  const [cocktails, setCocktails] = useState<CocktailWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalVotes, setTotalVotes] = useState(0);
  const [mostVotedCocktail, setMostVotedCocktail] = useState<CocktailWithStats | null>(null);
  const [leastVotedCocktail, setLeastVotedCocktail] = useState<CocktailWithStats | null>(null);
  const [highestRatedCocktail, setHighestRatedCocktail] = useState<CocktailWithStats | null>(null);
  const [bestAppearanceCocktail, setBestAppearanceCocktail] = useState<CocktailWithStats | null>(null);
  const [bestTasteCocktail, setBestTasteCocktail] = useState<CocktailWithStats | null>(null);
  const [bestInnovativenessCocktail, setBestInnovativenessCocktail] = useState<CocktailWithStats | null>(null);
  const [sortField, setSortField] = useState<SortField>('totalVotes');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [totalAppearance, setTotalAppearance] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cocktailsData = await cocktailService.getAllCocktails(locale);
        const cocktailsWithStats = await Promise.all(
          cocktailsData.map(async (cocktail) => {
            const stats = await ratingService.getRatingStats(cocktail.id);
            const totalVotes = stats.total_ratings;
          

            return {
              id: cocktail.id,
              name: cocktail.name,
              brand: cocktail.brand,
              totalVotes,
              averageAppearance: stats.appearance,
              averageTaste: stats.taste,
              averageInnovativeness: stats.innovativeness,
              averageOverall: (stats.appearance + stats.taste + stats.innovativeness) / 3
            };
          })
        );
        console.log(cocktailsWithStats)

        // Sort by different criteria
        const sortedByVotes = [...cocktailsWithStats].sort((a, b) => b.totalVotes - a.totalVotes);
        const sortedByOverall = [...cocktailsWithStats].sort((a, b) => b.averageOverall - a.averageOverall);
        const sortedByAppearance = [...cocktailsWithStats].sort((a, b) => b.averageAppearance - a.averageAppearance);
        const sortedByTaste = [...cocktailsWithStats].sort((a, b) => b.averageTaste - a.averageTaste);
        const sortedByInnovativeness = [...cocktailsWithStats].sort((a, b) => b.averageInnovativeness - a.averageInnovativeness);
        
        // Calculate total votes
        const totalVotesCount = cocktailsWithStats.reduce((sum, cocktail) => sum + cocktail.totalVotes, 0);
        
        // Calculate total appearance (average of all cocktails)
        const totalAppearanceValue = cocktailsWithStats.length > 0 
          ? cocktailsWithStats.reduce((sum, cocktail) => sum + cocktail.averageAppearance, 0) / cocktailsWithStats.length
          : 0;
        
        // Filter out cocktails with no votes for best ratings
        const cocktailsWithVotes = cocktailsWithStats.filter(c => c.totalVotes > 0);
        
        setCocktails(cocktailsWithStats);
        setTotalVotes(totalVotesCount);
        setTotalAppearance(totalAppearanceValue);
        setMostVotedCocktail(sortedByVotes[0] || null);
        setLeastVotedCocktail(sortedByVotes[sortedByVotes.length - 1] || null);
        setHighestRatedCocktail(sortedByOverall[0] || null);
        
        // Make sure we're using the filtered list for best ratings
        const filteredSortedByAppearance = [...cocktailsWithVotes].sort((a, b) => b.averageAppearance - a.averageAppearance);
        const filteredSortedByTaste = [...cocktailsWithVotes].sort((a, b) => b.averageTaste - a.averageTaste);
        const filteredSortedByInnovativeness = [...cocktailsWithVotes].sort((a, b) => b.averageInnovativeness - a.averageInnovativeness);
        
    
        setBestAppearanceCocktail(filteredSortedByAppearance.length > 0 ? filteredSortedByAppearance[0] : null);
        setBestTasteCocktail(filteredSortedByTaste.length > 0 ? filteredSortedByTaste[0] : null);
        setBestInnovativenessCocktail(filteredSortedByInnovativeness.length > 0 ? filteredSortedByInnovativeness[0] : null);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [locale]);

  if (loading) {
    return (
      <div className="w-full grid place-items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-6 relative bg-[#F9F6F0]">
      <div className="w-full max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-[#334798]">
          {t('title')}
        </h1>
        
        {/* Summary Cards - First Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title={t('totalVotes')} 
            value={totalVotes.toString()} 
            icon="📊"
          />
          <StatCard 
            title={t('mostVoted')} 
            value={mostVotedCocktail?.name || '-'} 
            subtitle={`${mostVotedCocktail?.totalVotes || 0} ${t('votes')}`}
            icon="🏆"
          />
          <StatCard 
            title={t('highestRated')} 
            value={highestRatedCocktail?.name || '-'} 
            subtitle={`${highestRatedCocktail?.averageOverall.toFixed(1) || 0}`}
            icon="⭐"
          />
        </div>
        
        {/* Best in Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title={t('bestAppearance')} 
            value={bestAppearanceCocktail?.name || '-'} 
            subtitle={`${bestAppearanceCocktail?.averageAppearance|| 0}`}
            icon="👁️"
          />
          <StatCard 
            title={t('bestTaste')} 
            value={bestTasteCocktail?.name || '-'} 
            subtitle={`${bestTasteCocktail?.averageTaste || 0}`}
            icon="👅"
          />
          <StatCard 
            title={t('bestInnovativeness')} 
            value={bestInnovativenessCocktail?.name || '-'} 
            subtitle={`${bestInnovativenessCocktail?.averageInnovativeness || 0}`}
            icon="💡"
          />
          
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-[#334798]">{t('votesDistribution')}</h2>
            <PieChart 
              data={cocktails.map(c => ({ 
                name: c.name, 
                value: c.totalVotes 
              }))} 
            />
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-[#334798]">{t('averageRatings')}</h2>
            <BarChart 
              data={cocktails.map(c => ({
                name: c.name,
                appearance: c.averageAppearance,
                taste: c.averageTaste,
                innovativeness: c.averageInnovativeness,
                overall: c.averageOverall
              }))}
              categories={[
                { key: 'appearance', label: t('appearance') },
                { key: 'taste', label: t('taste') },
                { key: 'innovativeness', label: t('innovativeness') },
                { key: 'overall', label: t('overall') }
              ]}
            />
          </div>
        </div>
        
        {/* Detailed Table */}
        <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-[#334798]">{t('detailedResults')}</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{t('sortBy')}:</span>
              <select 
                className="border rounded px-2 py-1 text-sm"
                value={sortField}
                onChange={(e) => setSortField(e.target.value as SortField)}
              >
                <option value="name">{t('cocktail')}</option>
                <option value="brand">{t('brand')}</option>
                <option value="totalVotes">{t('totalVotes')}</option>
                <option value="averageAppearance">{t('appearance')}</option>
                <option value="averageTaste">{t('taste')}</option>
                <option value="averageInnovativeness">{t('innovativeness')}</option>
                <option value="averageOverall">{t('overall')}</option>
              </select>
              <button 
                className="border rounded p-1"
                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              >
                {sortDirection === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => {
                    setSortField('name');
                    setSortDirection(sortField === 'name' && sortDirection === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  {t('cocktail')} {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => {
                    setSortField('brand');
                    setSortDirection(sortField === 'brand' && sortDirection === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  {t('brand')} {sortField === 'brand' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => {
                    setSortField('totalVotes');
                    setSortDirection(sortField === 'totalVotes' && sortDirection === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  {t('totalVotes')} {sortField === 'totalVotes' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => {
                    setSortField('averageAppearance');
                    setSortDirection(sortField === 'averageAppearance' && sortDirection === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  {t('appearance')} {sortField === 'averageAppearance' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => {
                    setSortField('averageTaste');
                    setSortDirection(sortField === 'averageTaste' && sortDirection === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  {t('taste')} {sortField === 'averageTaste' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => {
                    setSortField('averageInnovativeness');
                    setSortDirection(sortField === 'averageInnovativeness' && sortDirection === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  {t('innovativeness')} {sortField === 'averageInnovativeness' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => {
                    setSortField('averageOverall');
                    setSortDirection(sortField === 'averageOverall' && sortDirection === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  {t('overall')} {sortField === 'averageOverall' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cocktails
                .sort((a, b) => {
                  const aValue = a[sortField];
                  const bValue = b[sortField];
                  
                  if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return sortDirection === 'asc' 
                      ? aValue.localeCompare(bValue) 
                      : bValue.localeCompare(aValue);
                  }
                  
                  return sortDirection === 'asc' 
                    ? (aValue as number) - (bValue as number) 
                    : (bValue as number) - (aValue as number);
                })
                .map((cocktail) => (
                <tr key={cocktail.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {cocktail.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {cocktail.brand}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {cocktail.totalVotes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {cocktail.averageAppearance}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {cocktail.averageTaste}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {cocktail.averageInnovativeness}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {cocktail.averageOverall.toFixed(1)}
                  </td>
                </tr>
              ))}
              {/* Total row */}
              <tr className="bg-gray-100 font-semibold">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  TOTAL
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  -
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {totalVotes}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  
                  {(cocktails.reduce((sum, c) => sum + c.averageAppearance, 0) )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {(cocktails.reduce((sum, c) => sum + c.averageTaste, 0))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {(cocktails.reduce((sum, c) => sum + c.averageInnovativeness, 0))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {(cocktails.reduce((sum, c) => sum + c.averageOverall, 0))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
