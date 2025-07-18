import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import useRepos from "@/hooks/useRepos";

export default function RepsList() {
  const { id } = useParams(); // params 必须放在外面，
  const navigate = useNavigate();
  const { repos, loading, error } = useRepos(id);

  useEffect(() => {
    if (!id.trim()) {
      navigate("/");
      return;
    }
  }, [id]);

  return (
    <>
      <div>RepsList</div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {
        <ul>
          {repos.map((repo) => (
            <li key={repo.id}>
              <Link to={`/users/${id}/repos/${repo.id}`}>{repo.name}</Link>
            </li>
          ))}
        </ul>
      }
    </>
  );
}
