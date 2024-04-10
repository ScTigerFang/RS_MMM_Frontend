// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import RS_MMM from "./components/RS_MMM";
import ResumePage from "./components/ResumePage";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rs_MMM" element={<RS_MMM />} />
          <Route path="/resume" element={<ResumePage />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
