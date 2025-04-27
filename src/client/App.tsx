import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ContentPage from "./components/ContentPage";
import Navigation from "./components/Navigation";
import "./styles/App.css";

function App() {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="content">
          <Routes>
            <Route path="/:path*" element={<ContentPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
