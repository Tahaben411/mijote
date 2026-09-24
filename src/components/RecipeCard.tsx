import { memo } from 'react';
import { Link } from 'react-router';
import type { Recipe } from '../types/Recipe';

function RecipeCard({ recipe }: { recipe: Recipe }) {
  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  return (
    <Link className="recipe-card" to={`/recettes/${recipe.id}`}>
      <img src={recipe.image} alt={`Présentation de ${recipe.name}`} loading="lazy" />
      <div className="recipe-card-body">
        <h2>{recipe.name}</h2>
        <div className="recipe-meta-row" aria-label="Informations principales">
          <span>★ {recipe.rating.toFixed(1)}</span>
          <span>{totalTime} min</span>
          <span>{recipe.difficulty}</span>
        </div>
        <p>{recipe.cuisine}</p>
      </div>
    </Link>
  );
}

export default memo(RecipeCard);
