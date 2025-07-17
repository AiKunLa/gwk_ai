import { Fragment } from "react";
import "./App.css";

function App() {
  const lists = [
    { id: 1, container: "内容1" },
    { id: 2, container: "内容2" },
    { id: 3, container: "内容3" },
  ];
  return lists.map((item) => (
    <Fragment key={item.id}>
      <h2>{item.container}</h2>
    </Fragment>
  ));
}
export default App;
