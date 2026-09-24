import type { MealType } from '../types/MealType';

interface MealTypeFilterProps {
  value: MealType | '';
  onChange: (value: MealType | '') => void;
}

const options: Array<{ value: MealType; label: string }> = [
  { value: 'breakfast', label: 'Petit-déjeuner' },
  { value: 'lunch', label: 'Déjeuner' },
  { value: 'dinner', label: 'Dîner' },
  { value: 'appetizer', label: 'Entrée' },
  { value: 'dessert', label: 'Dessert' },
  { value: 'beverage', label: 'Boisson' },
];

export default function MealTypeFilter({ value, onChange }: MealTypeFilterProps) {
  return (
    <label className="field">
      <span className="sr-only">Type de repas</span>
      <select value={value} onChange={(event) => onChange(event.target.value as MealType | '')}>
        <option value="">Tous les repas</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
