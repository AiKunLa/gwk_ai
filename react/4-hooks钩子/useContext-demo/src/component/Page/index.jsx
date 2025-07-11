import Child from "@/component/Child";
import { useTheme } from "@/hooks/useTheme";

export default function Page() {
  const theme = useTheme();

  return (
    <>
      {theme}
      <Child></Child>
    </>
  );
}
