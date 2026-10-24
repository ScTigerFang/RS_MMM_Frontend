import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  NavLink,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";
import HomePage from "./components/HomePage";
import RS_MMM from "./components/Money Making Page/RS_MMM";
import ResumePage from "./components/ResumePage";
import Footer from "./components/Footer";

const queryClient = new QueryClient();

function SiteLayout() {
  const { pathname } = useLocation();
  const isResume = pathname === "/resume";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className={"site-shell" + (isResume ? " site-shell--resume" : "")}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="site-header">
        <div className="site-header-inner">
          <NavLink className="brand" to="/" aria-label="TigerFang, home">
            <img
              className="brand-logo"
              src="/image/tigerfang-logo.png"
              alt=""
              width="74"
              height="64"
            />
            <span>
              <span className="brand-name">TigerFang</span>
              <span className="brand-caption">Daniel Beals</span>
            </span>
          </NavLink>
          <nav className="site-nav" aria-label="Main navigation">
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/rs_MMM">RS MMM</NavLink>
            <NavLink to="/resume">Resume</NavLink>
          </nav>
        </div>
      </header>
      <main className="site-main" id="main-content" tabIndex="-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rs_MMM" element={<RS_MMM />} />
          <Route path="/resume" element={<ResumePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <SiteLayout />
      </Router>
    </QueryClientProvider>
  );
}
