import './FilterPanel.css';

const familyGroups = [
  { id: 'floral', label: 'Floral', keywords: ['floral'] },
  { id: 'citrico', label: 'Cítrico', keywords: ['cítrica', 'citrica'] },
  { id: 'amaderado', label: 'Amaderado', keywords: ['amaderada', 'amaderado'] },
  { id: 'dulce', label: 'Dulce / Gourmand', keywords: ['gourmand', 'vainill', 'ámbar', 'ambar', 'amber'] },
  { id: 'oriental', label: 'Oriental', keywords: ['oriental'] },
  { id: 'fresco', label: 'Fresco / Acuático', keywords: ['acuática', 'acuatica', 'fresca', 'fresco'] },
  { id: 'frutal', label: 'Frutal', keywords: ['frutal'] },
  { id: 'aromatico', label: 'Aromático', keywords: ['aromática', 'aromatica', 'fougère', 'fougere'] },
];

function FilterPanel({ isOpen, onClose, activeCategory, onCategoryChange, activeFamilies, onFamilyChange, activeSpecial, onSpecialChange }) {

  function toggleFamily(id) {
    if (activeFamilies.includes(id)) {
      onFamilyChange(activeFamilies.filter((f) => f !== id));
    } else {
      onFamilyChange([...activeFamilies, id]);
    }
  }

  function clearAll() {
    onCategoryChange('todos');
    onFamilyChange([]);
    onSpecialChange('');
  }

  const hasFilters = activeCategory !== 'todos' || activeFamilies.length > 0 || activeSpecial;

  return (
    <>
      <div className={`filter-overlay ${isOpen ? 'filter-overlay--visible' : ''}`} onClick={onClose} />

      <aside className={`filter-panel ${isOpen ? 'filter-panel--open' : ''}`}>
        <div className="filter-panel__header">
          <h2>Filtros</h2>
          <button className="filter-panel__close" onClick={onClose}>✕</button>
        </div>

        {hasFilters && (
          <button className="filter-clear" onClick={clearAll}>
            Limpiar filtros
          </button>
        )}

        <div className="filter-panel__body">
          <div className="filter-section">
            <h3 className="filter-section__title">Categoría</h3>
            <div className="filter-options">
              {[
                  { id: 'todos', label: 'Todos' },
                  { id: 'dama', label: 'Dama' },
                  { id: 'caballero', label: 'Caballero' },
                  { id: 'arabes_dama', label: 'Árabes Dama' },
                  { id: 'arabes_caballero', label: 'Árabes Caballero' },
                  { id: 'decants', label: 'Decants' },
                  { id: 'sets', label: 'Sets / Combos' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  className={`filter-option ${activeCategory === cat.id ? 'filter-option--active' : ''}`}
                  onClick={() => onCategoryChange(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3 className="filter-section__title">Familia olfativa</h3>
            <div className="filter-options">
              {familyGroups.map((group) => (
                <button
                  key={group.id}
                  className={`filter-option ${activeFamilies.includes(group.id) ? 'filter-option--active' : ''}`}
                  onClick={() => toggleFamily(group.id)}
                >
                  {group.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3 className="filter-section__title">Especiales</h3>
            <div className="filter-options">
              {[
                { id: 'destacados', label: 'Destacados' },
                { id: 'mas_vendidos', label: 'Más vendidos' },
                { id: 'ofertas', label: 'Ofertas' },
              ].map((special) => (
                <button
                  key={special.id}
                  className={`filter-option ${activeSpecial === special.id ? 'filter-option--active' : ''}`}
                  onClick={() => onSpecialChange(activeSpecial === special.id ? '' : special.id)}
                >
                  {special.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3 className="filter-section__title">Precio</h3>
            <div className="filter-options">
              {[
                { id: 'precio_asc', label: 'Precio ↑' },
                { id: 'precio_desc', label: 'Precio ↓' },
              ].map((price) => (
                <button
                  key={price.id}
                  className={`filter-option ${activeSpecial === price.id ? 'filter-option--active' : ''}`}
                  onClick={() => onSpecialChange(activeSpecial === price.id ? '' : price.id)}
                >
                  {price.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="filter-panel__footer">
          <button className="filter-apply" onClick={onClose}>
            Ver resultados
          </button>
        </div>
      </aside>
    </>
  );
}

export { familyGroups };
export default FilterPanel;