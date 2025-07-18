import { useContext, useEffect } from "react";
import { GlobalContext } from "@/context/GlobalContextProvider";
import { getRepos } from "@/api/repos";

// 将响应式业务逻辑抽离出来 useRepos
export default function useRepos(id) {
  const { state, dispatch } = useContext(GlobalContext);
  useEffect(() => {
    console.log("--------------------");
    fetchRepos(id);
  }, []);

  const fetchRepos = async (id) => {
    try {
      dispatch({
        type: "FETCH_STARE",
      });
      const res = await getRepos(id);
      dispatch({
        type: "FETCH_SUCCESS",
        payload: res.data,  
      });
    } catch (err) {
      dispatch({
        type: "FETCH_ERROR",
        payload: err,
      });
    }
  };

  return state;
}
