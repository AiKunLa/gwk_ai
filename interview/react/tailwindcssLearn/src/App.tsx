import { RouterProvider } from "react-router-dom"
import { router } from "@/router"
import { AppProvider } from "@/config/AppProvider"
import { QueryProvider } from "@/config/QueryProvider"

function App() {

  return (
    <>
      <AppProvider>
        <QueryProvider>
          <RouterProvider router={router} />
        </QueryProvider>
      </AppProvider>
    </>
  )
}

export default App