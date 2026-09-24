import { Link } from 'react-router';
import EmptyState from '../components/EmptyState';
import { useShoppingList } from '../context/ShoppingListContext';

export default function ShoppingListPage() {
  const { entries, toggleItem, removeRecipe, clear } = useShoppingList();
  const totalItems = entries.reduce((sum, entry) => sum + entry.items.length, 0);
  const checkedItems = entries.reduce(
    (sum, entry) => sum + entry.items.filter((item) => item.checked).length,
    0
  );

  return (
    <section>
      <div className="page-heading shopping-heading">
        <div>
          <p className="eyebrow">À emporter au magasin</p>
          <h1>Ma liste de courses</h1>
          <p>{entries.length} recette{entries.length > 1 ? 's' : ''} · {checkedItems}/{totalItems} ingrédients cochés</p>
        </div>
        {entries.length > 0 && (
          <button className="button secondary" type="button" onClick={clear}>Vider la liste</button>
        )}
      </div>

      {entries.length === 0 ? (
        <EmptyState
          title="Votre liste est vide"
          message="Ajoutez une recette pour retrouver automatiquement tous ses ingrédients ici."
          action={<Link className="button primary" to="/">Voir le catalogue</Link>}
        />
      ) : (
        <div className="shopping-groups">
          {entries.map((entry) => (
            <section className="shopping-group" key={entry.recipeId}>
              <div className="shopping-group-header">
                <h2>{entry.recipeName}</h2>
                <button className="link-button danger" type="button" onClick={() => removeRecipe(entry.recipeId)}>
                  Retirer
                </button>
              </div>
              <ul className="check-list">
                {entry.items.map((item, index) => (
                  <li key={`${entry.recipeId}-${index}`}>
                    <label className={item.checked ? 'checked-item' : ''}>
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleItem(entry.recipeId, index)}
                      />
                      <span>{item.label}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </section>
  );
}
