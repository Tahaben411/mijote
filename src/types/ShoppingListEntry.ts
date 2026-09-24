export interface ShoppingListItem {
  label: string;
  checked: boolean;
}

export interface ShoppingListEntry {
  recipeId: number;
  recipeName: string;
  items: ShoppingListItem[];
}
