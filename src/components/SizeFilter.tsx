import './SizeFilter.css'

type SizeFilterProps = {
  sizes: string[]
  selected: string | null
  onSelect: (size: string | null) => void
}

export function SizeFilter({ sizes, selected, onSelect }: SizeFilterProps) {
  return (
    <div className="size-filter" role="group" aria-label="Filtrar por tamanho">
      <button
        type="button"
        className={selected === null ? 'is-active' : undefined}
        onClick={() => onSelect(null)}
      >
        Todos
      </button>
      {sizes.map((size) => (
        <button
          key={size}
          type="button"
          className={selected === size ? 'is-active' : undefined}
          onClick={() => onSelect(size)}
        >
          {size}
        </button>
      ))}
    </div>
  )
}
