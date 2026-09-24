import type { Difficulty } from './Recipe';

export interface NewRecipe {
  name: string;
  cuisine: string;
  difficulty: Difficulty;
  prepTimeMinutes: number;
  servings: number;
  ingredients: string[];
  instructions: string[];
  userId: number;
}

export interface CreatedRecipe extends NewRecipe {
  id: number;
}
