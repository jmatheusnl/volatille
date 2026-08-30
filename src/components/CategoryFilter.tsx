import './CategoryFilter.css'

type CategoryFilterProps = {
  categories: string[]
  selected: string | null
  onSelect: (category: string | null) => void
}

export function CategoryFilter({
  categories,
  selected,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div className="category-filter" role="group" aria-label="Filtrar por categoria">
      <button
        type="button"
        className={selected === null ? 'is-active' : undefined}
        onClick={() => onSelect(null)}
      >
        Todos
      </button>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={selected === category ? 'is-active' : undefined}
          onClick={() => onSelect(category)}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
