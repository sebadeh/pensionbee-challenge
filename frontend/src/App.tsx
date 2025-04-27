import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation/Navigation";
import ContentPage from "./components/ContentPage/ContentPage";
import NotFound from "./components/NotFound/NotFound";
import "./styles/App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="content">
          <Routes>
            <Route path="/" element={<ContentPage />} />
            <Route path="/:path*" element={<ContentPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
