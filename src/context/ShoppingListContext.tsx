import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type PropsWithChildren,
} from 'react';
import type { Recipe } from '../types/Recipe';
import type { ShoppingListEntry } from '../types/ShoppingListEntry';

type ShoppingAction =
  | { type: 'ADD_RECIPE'; recipe: Recipe }
  | { type: 'TOGGLE_ITEM'; recipeId: number; itemIndex: number }
  | { type: 'REMOVE_RECIPE'; recipeId: number }
  | { type: 'CLEAR' };

interface ShoppingActions {
  addRecipe: (recipe: Recipe) => void;
  toggleItem: (recipeId: number, itemIndex: number) => void;
  removeRecipe: (recipeId: number) => void;
  clear: () => void;
}

const STORAGE_KEY = 'mijote-shopping-list';

const ShoppingListStateContext = createContext<ShoppingListEntry[] | null>(null);
const ShoppingListActionsContext = createContext<ShoppingActions | null>(null);
const ShoppingListCountContext = createContext<number | null>(null);

function loadInitialState(): ShoppingListEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ShoppingListEntry[]) : [];
  } catch {
    return [];
  }
}

function shoppingReducer(
  state: ShoppingListEntry[],
  action: ShoppingAction
): ShoppingListEntry[] {
  switch (action.type) {
    case 'ADD_RECIPE': {
      if (state.some((entry) => entry.recipeId === action.recipe.id)) return state;
      return [
        ...state,
        {
          recipeId: action.recipe.id,
          recipeName: action.recipe.name,
          items: action.recipe.ingredients.map((label) => ({ label, checked: false })),
        },
      ];
    }
    case 'TOGGLE_ITEM':
      return state.map((entry) =>
        entry.recipeId !== action.recipeId
          ? entry
          : {
              ...entry,
              items: entry.items.map((item, index) =>
                index === action.itemIndex ? { ...item, checked: !item.checked } : item
              ),
            }
      );
    case 'REMOVE_RECIPE':
      return state.filter((entry) => entry.recipeId !== action.recipeId);
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

export function ShoppingListProvider({ children }: PropsWithChildren) {
  const [entries, dispatch] = useReducer(shoppingReducer, [], () => loadInitialState());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // L'application reste utilisable même si localStorage est indisponible.
    }
  }, [entries]);

  const actions = useMemo<ShoppingActions>(
    () => ({
      addRecipe: (recipe) => dispatch({ type: 'ADD_RECIPE', recipe }),
      toggleItem: (recipeId, itemIndex) =>
        dispatch({ type: 'TOGGLE_ITEM', recipeId, itemIndex }),
      removeRecipe: (recipeId) => dispatch({ type: 'REMOVE_RECIPE', recipeId }),
      clear: () => dispatch({ type: 'CLEAR' }),
    }),
    []
  );

  const recipeCount = entries.length;

  return (
    <ShoppingListCountContext.Provider value={recipeCount}>
      <ShoppingListActionsContext.Provider value={actions}>
        <ShoppingListStateContext.Provider value={entries}>
          {children}
        </ShoppingListStateContext.Provider>
      </ShoppingListActionsContext.Provider>
    </ShoppingListCountContext.Provider>
  );
}

export function useShoppingList() {
  const entries = useContext(ShoppingListStateContext);
  const actions = useContext(ShoppingListActionsContext);
  if (entries === null || actions === null) {
    throw new Error('useShoppingList doit être utilisé dans ShoppingListProvider.');
  }
  return { entries, ...actions };
}

export function useShoppingListCount() {
  const count = useContext(ShoppingListCountContext);
  if (count === null) {
    throw new Error('useShoppingListCount doit être utilisé dans ShoppingListProvider.');
  }
  return count;
}
