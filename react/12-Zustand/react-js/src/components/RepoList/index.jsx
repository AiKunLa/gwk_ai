import { useRepoStore } from "@/store/repos";
import { useEffect } from "react";

export default function RepoList() {
  const { repos, loading, error, fetchRepoList } = useRepoStore();
  useEffect(() => {
    fetchRepoList("shunwuyu");
  }, []);
  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <h2>Repo List</h2>
      <ul>
        {repos.map((item) => {
          return (
            <li key={item.id}>
              <a href={item.html_url} target="_blank" rel="noreferrer">
                {item.name}
              </a>
            </li>
          );
        })}
      </ul>
      {error && <div>Error: {error.message}</div>}
    </div>
  );
}
