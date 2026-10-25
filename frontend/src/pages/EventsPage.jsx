import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import EventCard from '../components/EventCard.jsx';
import SearchFilter from '../components/SearchFilter.jsx';
import { api } from '../services/api.js';
import '../styles/events.css';

export default function EventsPage() {
  // Search + category are kept in the URL (e.g. /events?category=Workshop&search=AI)
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Wait 300 ms after the user stops typing before calling the API
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Keep the search text in the URL so the page can be shared / refreshed
  useEffect(() => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        if (debouncedSearch) params.set('search', debouncedSearch);
        else params.delete('search');
        return params;
      },
      { replace: true }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Fetch events from the backend whenever the filters change
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    api
      .getEvents({ search: debouncedSearch, category })
      .then((data) => active && setEvents(data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [debouncedSearch, category]);

  const changeCategory = (value) => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        if (value) params.set('category', value);
        else params.delete('category');
        return params;
      },
      { replace: true }
    );
  };

  return (
    <main>
      <section className="page-header">
        <div className="container">
          <h1>Upcoming Events</h1>
          <p>Find something you love and reserve your seat.</p>
        </div>
      </section>

      <section className="container">
        <SearchFilter
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={changeCategory}
        />

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="spinner" aria-label="Loading events" />
        ) : (
          <>
            <p className="results-count">
              Showing {events.length} event{events.length === 1 ? '' : 's'}
              {category && ` in ${category}`}
              {debouncedSearch && ` matching “${debouncedSearch}”`}
            </p>

            {events.length === 0 && !error ? (
              <div className="empty-state">
                <h3>No events found</h3>
                <p>Try a different search term or category.</p>
              </div>
            ) : (
              <div className="events-grid">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
