import { useContext } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Home } from './pages/Home/Home.tsx'
import { AppwriteContext } from './context.ts'
import { OverviewScreen } from './pages/Overview/Overview.tsx'

function App() {
  const initialContext = useContext(AppwriteContext)
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/overview',
      element: <OverviewScreen />
    }
  ])

  return (
    <AppwriteContext.Provider value={initialContext}>
      <RouterProvider router={router} />
    </AppwriteContext.Provider>
  )
}

export default App
