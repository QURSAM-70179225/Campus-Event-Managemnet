import { CATEGORIES } from '../config.js';
import '../styles/search.css';

/**
 * Search box + category filter chips.
 * Props:
 *   search, onSearchChange(value)
 *   category, onCategoryChange(value)   ('' means All)
 */
export default function SearchFilter({ search, onSearchChange, category, onCategoryChange }) {
  return (
    <div className="event-toolbar">
      <div className="search-box">
        <label htmlFor="event-search" className="sr-only">
          Search events
        </label>
        <span className="search-icon" aria-hidden="true">🔍</span>
        <input
          id="event-search"
          type="search"
          placeholder="Search events, e.g. AI Workshop"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="category-filters" role="group" aria-label="Filter by category">
        <button
          type="button"
          className={`chip ${category === '' ? 'is-active' : ''}`}
          onClick={() => onCategoryChange('')}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`chip ${category === cat ? 'is-active' : ''}`}
            aria-pressed={category === cat}
            onClick={() => onCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
