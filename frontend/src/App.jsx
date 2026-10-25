import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import EventsPage from './pages/EventsPage.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <main className="container section">
              <h1>Campus Events</h1>
              <p>Home page coming soon.</p>
            </main>
          }
        />
        <Route path="/events" element={<EventsPage />} />
      </Routes>
      <Footer />
    </>
  );
}
