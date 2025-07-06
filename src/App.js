// App.js
import { QueryClient, QueryClientProvider } from "react-query";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import './App.css'; // Ensure this file exists to include the styles
import HomePage from "./components/HomePage";
import RS_MMM from "./components/Money Making Page/RS_MMM";
import ResumePage from "./components/ResumePage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div>
          <nav className="navbar">
            <ul className="navbar-list">
              <li>
                <Link to="/" className="navbar-link">Home</Link>
              </li>
              <li>
                <Link to="/rs_MMM" className="navbar-link">RS MMM</Link>
              </li>
              <li>
                <Link to="/resume" className="navbar-link">Resume</Link>
              </li>
            </ul>
          </nav>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/rs_MMM" element={<RS_MMM />} />
            <Route path="/resume" element={<ResumePage />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
