import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import "./App.css";
import { lazy, Suspense } from "react";

function App() {
  const Home = lazy(() => import("./pages/Home"));
  const About = lazy(() => import("./pages/About"));
  const Login = lazy(() => import("./pages/Login"));
  return (
    <>
      <Router>
        <Navigation />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Suspense>
      </Router>
    </>
  );
}
export default App;
