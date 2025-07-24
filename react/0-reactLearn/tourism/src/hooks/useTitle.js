import { useEffect } from "react";

/**
 * 自定义hooks 用于设置页面标题
 * @param {*} title 页面标题
 */
function useTitle(title) {
  useEffect(() => {
    document.title = title;
  }, []);
}

export default useTitle;
export { useTitle };
