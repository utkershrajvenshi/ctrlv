import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Home } from './pages/Home/Home.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { OverviewScreen } from './pages/Overview/Overview.tsx'
import { SupabaseContext, supabase } from './context.ts'

function App() {
  const queryClient = new QueryClient()
  queryClient.invalidateQueries({ queryKey: ['fetchExistingBoards'] })
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
    <SupabaseContext.Provider value={{ supabase }}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SupabaseContext.Provider>
  )
}

export default App
