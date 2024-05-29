import { useContext } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Home } from './pages/Home/Home.tsx'
import { AppwriteContext } from './context.ts'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { OverviewScreen } from './pages/Overview/Overview.tsx'

function App() {
  const initialContext = useContext(AppwriteContext)
  const queryClient = new QueryClient()
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
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppwriteContext.Provider>
  )
}

export default App
