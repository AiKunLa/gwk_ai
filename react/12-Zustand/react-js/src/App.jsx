import "./App.css";
import Counter from "./components/Counter";
import { useCounterStore } from "@/store/count";
import Todo from "./components/Todo";
import RepoList from "./components/RepoList";

function App() {
  const { count } = useCounterStore();
  return (
    <>
      <h2>{count}</h2>
      {/* <Counter /> */}
      {/* <Todo /> */}
      <RepoList />
    </>
  );
}

export default App;
