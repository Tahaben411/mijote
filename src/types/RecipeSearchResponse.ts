import type { Recipe } from './Recipe';

export interface RecipeSearchResponse {
  recipes: Recipe[];
  total: number;
  skip: number;
  limit: number;
}
