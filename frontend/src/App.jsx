import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

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
      </Routes>
      <Footer />
    </>
  );
}
