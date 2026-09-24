import type { Recipe } from '../types/Recipe';
import type { RecipeSearchResponse } from '../types/RecipeSearchResponse';
import type { LoginCredentials, AuthUser } from '../types/Auth';
import type { CreatedRecipe, NewRecipe } from '../types/NewRecipe';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function assertOk(response: Response, message: string): Promise<void> {
  if (!response.ok) {
    throw new ApiError(message, response.status);
  }
}

export async function searchRecipes(
  query: string,
  signal?: AbortSignal
): Promise<RecipeSearchResponse> {
  const response = await fetch(
    `${API_BASE_URL}/recipes/search?q=${encodeURIComponent(query)}&limit=0`,
    { signal }
  );

  await assertOk(response, 'Impossible de charger les recettes.');
  return response.json() as Promise<RecipeSearchResponse>;
}

export async function getRecipeById(
  id: number,
  signal?: AbortSignal
): Promise<Recipe> {
  const response = await fetch(`${API_BASE_URL}/recipes/${id}`, { signal });
  await assertOk(response, 'Impossible de charger cette recette.');
  return response.json() as Promise<Recipe>;
}

export async function login(credentials: LoginCredentials): Promise<AuthUser> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  await assertOk(response, 'La connexion a échoué.');
  return response.json() as Promise<AuthUser>;
}

export async function getCurrentUser(token: string): Promise<Omit<AuthUser, 'accessToken'>> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  await assertOk(response, 'Session invalide.');
  return response.json() as Promise<Omit<AuthUser, 'accessToken'>>;
}

export async function createRecipe(payload: NewRecipe): Promise<CreatedRecipe> {
  const response = await fetch(`${API_BASE_URL}/recipes/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  await assertOk(response, 'Impossible de créer la recette.');
  return response.json() as Promise<CreatedRecipe>;
}
