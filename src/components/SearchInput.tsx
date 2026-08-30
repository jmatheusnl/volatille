import './SearchInput.css'

type SearchInputProps = {
  value: string
  onChange: (value: string) => void
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <label className="search-input" aria-label="Buscar aroma no catálogo">
      <input
        id="catalog-search"
        name="catalog-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar por aroma…"
      />
    </label>
  )
}
