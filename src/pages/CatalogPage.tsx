import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import SearchBar from '../components/SearchBar';
import MealTypeFilter from '../components/MealTypeFilter';
import SortSelect, { type SortOption } from '../components/SortSelect';
import RecipeList from '../components/RecipeList';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { searchRecipes } from '../services/api';
import { useFetch } from '../hooks/useFetch';
import { useDebounce } from '../hooks/useDebounce';
import type { MealType } from '../types/MealType';

function isMealType(value: string | null): value is MealType {
  return ['breakfast', 'lunch', 'dinner', 'appetizer', 'dessert', 'beverage'].includes(value ?? '');
}

function isSortOption(value: string | null): value is SortOption {
  return ['relevance', 'rating', 'time', 'name'].includes(value ?? '');
}

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const initialMeal = searchParams.get('repas');
  const initialSort = searchParams.get('tri');
  const [mealType, setMealType] = useState<MealType | ''>(isMealType(initialMeal) ? initialMeal : '');
  const [sort, setSort] = useState<SortOption>(isSortOption(initialSort) ? initialSort : 'relevance');
  const debouncedQuery = useDebounce(query, 400);

  const fetchRecipes = useCallback(
    (signal: AbortSignal) => searchRecipes(debouncedQuery, signal),
    [debouncedQuery]
  );

  const { data, loading, error, reload } = useFetch(fetchRecipes);

  const visibleRecipes = useMemo(() => {
    if (!data) return [];
    const filtered = mealType
      ? data.recipes.filter((recipe) =>
          recipe.mealType.some((type) => type.toLowerCase() === mealType.toLowerCase())
        )
      : data.recipes;

    const sorted = [...filtered];
    if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating);
    if (sort === 'time') {
      sorted.sort(
        (a, b) =>
          a.prepTimeMinutes + a.cookTimeMinutes - (b.prepTimeMinutes + b.cookTimeMinutes)
      );
    }
    if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [data, mealType, sort]);

  function syncUrl(nextQuery: string, nextMeal: MealType | '', nextSort: SortOption) {
    const params = new URLSearchParams();
    if (nextQuery.trim()) params.set('q', nextQuery.trim());
    if (nextMeal) params.set('repas', nextMeal);
    if (nextSort !== 'relevance') params.set('tri', nextSort);
    setSearchParams(params, { replace: true });
  }

  function handleQuery(value: string) {
    setQuery(value);
    syncUrl(value, mealType, sort);
  }

  function handleMeal(value: MealType | '') {
    setMealType(value);
    syncUrl(query, value, sort);
  }

  function handleSort(value: SortOption) {
    setSort(value);
    syncUrl(query, mealType, value);
  }

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Cuisine simple, idées rapides</p>
          <h1>Catalogue</h1>
        </div>
      </div>

      <div className="catalog-controls" aria-label="Recherche et filtres">
        <SearchBar value={query} onChange={handleQuery} />
        <MealTypeFilter value={mealType} onChange={handleMeal} />
        <SortSelect value={sort} onChange={handleSort} />
      </div>

      {loading && <Loader label="Chargement des recettes…" />}
      {!loading && error && <ErrorMessage message={error.message} onRetry={reload} />}

      {!loading && !error && (
        <>
          <p className="result-count">{visibleRecipes.length} recette{visibleRecipes.length > 1 ? 's' : ''}</p>
          {visibleRecipes.length > 0 ? (
            <RecipeList recipes={visibleRecipes} />
          ) : (
            <EmptyState
              title="Aucun résultat"
              message="Essayez un autre terme de recherche ou retirez un filtre."
            />
          )}
        </>
      )}
    </section>
  );
}
