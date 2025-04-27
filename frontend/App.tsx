import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import ContentPage from "./components/ContentPage";
import "./styles/App.css";

function App() {
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
