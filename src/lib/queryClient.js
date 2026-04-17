import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000, // 1 min - data considered fresh
      gcTime: 5 * 60_000, // 5 min - keep in cache after unmount
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})
