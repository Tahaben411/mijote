import type { Recipe } from '../types/Recipe';
import RecipeCard from './RecipeCard';

export default function RecipeList({ recipes }: { recipes: Recipe[] }) {
  return (
    <div className="recipe-grid">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
