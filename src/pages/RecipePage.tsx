import { useCallback } from 'react';
import { useParams } from 'react-router';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { ApiError, getRecipeById } from '../services/api';
import { useFetch } from '../hooks/useFetch';
import { useShoppingList } from '../context/ShoppingListContext';

export default function RecipePage() {
  const { id } = useParams();
  const recipeId = Number(id);
  const { entries, addRecipe } = useShoppingList();

  const fetchRecipe = useCallback(
    (signal: AbortSignal) => {
      if (!Number.isInteger(recipeId) || recipeId <= 0) {
        return Promise.reject(new ApiError('Recette introuvable', 404));
      }
      return getRecipeById(recipeId, signal);
    },
    [recipeId]
  );

  const { data: recipe, loading, error, reload } = useFetch(fetchRecipe);

  if (loading) return <Loader label="Chargement de la recette…" />;
  if (error instanceof ApiError && error.status === 404) {
    return <EmptyState title="Recette introuvable" message="Cette recette n'existe pas ou a été supprimée." />;
  }
  if (error) return <ErrorMessage message={error.message} onRetry={reload} />;
  if (!recipe) return null;

  const alreadyAdded = entries.some((entry) => entry.recipeId === recipe.id);

  return (
    <article className="recipe-detail">
      <img className="recipe-hero" src={recipe.image} alt={`Présentation de ${recipe.name}`} />
      <div className="recipe-detail-body">
        <p className="eyebrow">{recipe.cuisine}</p>
        <h1>{recipe.name}</h1>

        <div className="detail-stats">
          <span><strong>★ {recipe.rating}</strong><small>{recipe.reviewCount} avis</small></span>
          <span><strong>{recipe.prepTimeMinutes} min</strong><small>Préparation</small></span>
          <span><strong>{recipe.cookTimeMinutes} min</strong><small>Cuisson</small></span>
          <span><strong>{recipe.servings}</strong><small>Portions</small></span>
          <span><strong>{recipe.difficulty}</strong><small>Difficulté</small></span>
        </div>

        <button
          className="button primary full-width"
          type="button"
          onClick={() => addRecipe(recipe)}
          disabled={alreadyAdded}
        >
          {alreadyAdded ? 'Déjà dans ma liste' : '+ Ajouter à ma liste de courses'}
        </button>

        <section className="content-section">
          <h2>Ingrédients</h2>
          <ul>
            {recipe.ingredients.map((ingredient) => <li key={ingredient}>{ingredient}</li>)}
          </ul>
        </section>

        <section className="content-section">
          <h2>Instructions</h2>
          <ol>
            {recipe.instructions.map((instruction, index) => <li key={`${index}-${instruction}`}>{instruction}</li>)}
          </ol>
        </section>
      </div>
    </article>
  );
}
