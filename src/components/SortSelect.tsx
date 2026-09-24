export type SortOption = 'relevance' | 'rating' | 'time' | 'name';

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export default function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <label className="field">
      <span className="sr-only">Trier les recettes</span>
      <select value={value} onChange={(event) => onChange(event.target.value as SortOption)}>
        <option value="relevance">Pertinence</option>
        <option value="rating">Note décroissante</option>
        <option value="time">Temps total croissant</option>
        <option value="name">Nom de A à Z</option>
      </select>
    </label>
  );
}
