import useTitle from "../../hooks/useTitle";

export default function Home() {
  useTitle("首页");
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}

export { Home };
