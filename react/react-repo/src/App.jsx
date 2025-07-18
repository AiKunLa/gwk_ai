import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Loading from "./components/Loading";
const RepsList = lazy(() => import("./pages/RepsList"));
const RepoDetail = lazy(() => import("./pages/RepoDetail"));
const Home = lazy(() => import("./pages/Home"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users/:id/repos" element={<RepsList />} />
          <Route path="/users/:id/repos/:repoId" element={<RepoDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
