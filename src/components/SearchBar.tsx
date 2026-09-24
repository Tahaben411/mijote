interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <label className="field search-field">
      <span className="sr-only">Rechercher une recette</span>
      <input
        type="search"
        placeholder="Rechercher une recette…"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
