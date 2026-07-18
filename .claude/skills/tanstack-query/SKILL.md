---
name: tanstack-query
description: Guidelines for using TanStack Query (React Query) for server state management, data fetching, caching, and synchronization
---

# TanStack Query Best Practices

You are an expert in TanStack Query (formerly React Query), TypeScript, and React development. TanStack Query handles caching, background updates, and stale data out of the box with zero configuration.

## Core Principles

- Use TanStack Query for all server state management and data fetching
- Minimize the use of `useEffect` and `useState` for server data; favor TanStack Query's built-in state management
- Implement proper error handling with user-friendly messages
- Use TypeScript for full type safety with query responses

## Project Structure

```
regal_front/
  lib/
    configs/
      react-query.config.tsx    # QueryClient provider (ReactQueryProviders)
    http-wrapper/
      customFetcher.ts          # Base fetcher — wraps fetch(), logs requests, handles errors
      globalErrorHandler.ts     # Shared error handler for query/mutation callbacks
      types.ts                  # CustomFetchResponse / CustomFetchError types
  entities/                     # Feature-sliced domain modules
    auth/
      auth.actions.ts           # Raw API calls (used as queryFn / mutationFn)
      auth.hook.ts              # useQuery / useMutation hooks for auth
      auth.dto.ts               # Request / response DTO types
    catalog/
      catalog.actions.ts
      catalog.hook.ts
      catalog.dto.ts
    company/
      company.actions.ts
      company.hook.ts
      company.dto.ts
    item/
      item.actions.ts
      item.hook.ts
      item.dto.ts
    mockup/
      mockup.action.ts
      mockup.hook.ts
      mockup.dto.ts
    profile/
      profile-action.ts
      profile.hook.ts
      profile.dto.ts
    subscription/
      subscription.actions.ts
      subscription.hook.ts
      subscription.dto.ts
    tag/
      tag.action.ts
      tag.hook.ts
      tag.dto.ts
    fileUploader/
      fileUploader.actions.ts
      fileUploader.hook.ts
  hooks/                        # Shared cross-entity hooks
    useCustomFetch.ts           # Generic fetch wrapper (GET auto-fires, POST/PUT/DELETE on demand)
    useInfiniteScroll.ts        # useInfiniteQuery-backed infinite scroll
    useOfsetFetch.ts            # Offset-based paginated fetch
    useFilter.ts                # URL search-param driven filters + pagination
  app/
    (default)/                  # Authenticated app pages (dashboard, catalog, etc.)
    (auth)/                     # Auth pages (login, register, etc.)
    api/                        # Next.js API routes (upload, session, etc.)
  components/
    pages/                      # Page-specific components — consume entity hooks
    base/                       # Reusable UI primitives
    global/                     # App-wide shared components (toasts, nav, etc.)
    skeleton/                   # Loading skeleton components
  store/
    global.store.ts             # Zustand global store (toasts, confirms, UI state)
```

## Setup and Configuration

### Query Client Configuration

```typescript
// providers/QueryProvider.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30,   // 30 minutes (formerly cacheTime)
      retry: 3,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

## Query Best Practices

### 1. Query Key Organization

Use consistent, hierarchical query keys for efficient cache management:

```typescript
// Query key factory pattern
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: UserFilters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};
```

### 2. Custom Query Hooks

Create reusable, typed query hooks:

```typescript
// hooks/queries/useUser.7ts
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { userKeys } from '@/api/queryKeys';
import { getUser, User } from '@/api/endpoints/users';

export function useUser(
  userId: string,
  options?: Omit<UseQueryOptions<User, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => getUser(userId),
    enabled: !!userId,
    ...options,
  });
}
```

### 3. Dependent Queries

Handle queries that depend on other data:

```typescript
function useUserPosts(userId: string) {
  const { data: user } = useUser(userId);

  return useQuery({
    queryKey: ['posts', { userId }],
    queryFn: () => fetchUserPosts(userId),
    enabled: !!user, // Only run when user data is available
  });
}
```

### 4. Parallel Queries

Fetch multiple resources simultaneously:

```typescript
import { useQueries } from '@tanstack/react-query';

function useMultipleUsers(userIds: string[]) {
  return useQueries({
    queries: userIds.map((id) => ({
      queryKey: userKeys.detail(id),
      queryFn: () => getUser(id),
    })),
  });
}
```

## Mutation Best Practices

### 1. Optimistic Updates

Provide instant feedback while mutations are in flight:

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onMutate: async (newUser) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: userKeys.detail(newUser.id) });

      // Snapshot previous value
      const previousUser = queryClient.getQueryData(userKeys.detail(newUser.id));

      // Optimistically update
      queryClient.setQueryData(userKeys.detail(newUser.id), newUser);

      return { previousUser };
    },
    onError: (err, newUser, context) => {
      // Rollback on error
      queryClient.setQueryData(
        userKeys.detail(newUser.id),
        context?.previousUser
      );
    },
    onSettled: (data, error, variables) => {
      // Refetch after error or success
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
    },
  });
}
```

### 2. Cache Invalidation

Properly invalidate related queries after mutations:

```typescript
function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      // Invalidate all user-related queries
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}
```

## Error Handling

### 1. Global Error Handler

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError: false,
    },
    mutations: {
      onError: (error) => {
        // Global error handling (e.g., toast notification)
        toast.error(error.message);
      },
    },
  },
});
```

### 2. Component-Level Error Handling

```typescript
function UserProfile({ userId }: { userId: string }) {
  const { data, error, isLoading, isError } = useUser(userId);

  if (isLoading) return <Skeleton />;
  if (isError) return <ErrorMessage error={error} />;

  return <UserCard user={data} />;
}
```

### 3. Error Boundaries with Suspense

```typescript
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';

function App() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <Suspense fallback={<Loading />}>
        <UserProfile userId="123" />
      </Suspense>
    </ErrorBoundary>
  );
}
```

## Performance Optimization

### 1. Select and Transform Data

Only subscribe to the data you need:

```typescript
function useUserName(userId: string) {
  return useUser(userId, {
    select: (user) => user.name,
  });
}
```

### 2. Prefetching

Prefetch data before it's needed:

```typescript
function UserList() {
  const queryClient = useQueryClient();

  const prefetchUser = (userId: string) => {
    queryClient.prefetchQuery({
      queryKey: userKeys.detail(userId),
      queryFn: () => getUser(userId),
      staleTime: 1000 * 60 * 5,
    });
  };

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id} onMouseEnter={() => prefetchUser(user.id)}>
          {user.name}
        </li>
      ))}
    </ul>
  );
}
```

### 3. Infinite Queries

Handle paginated data efficiently:

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';

function useInfinitePosts() {
  return useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam }) => fetchPosts(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage.prevCursor,
  });
}
```

## Key Conventions

1. **Feature-based organization**: Group query hooks within feature-specific directories
2. **Consistent query keys**: Use factory functions for type-safe, organized keys
3. **Type safety**: Define TypeScript interfaces for all API responses
4. **DevTools**: Always include React Query DevTools in development
5. **Avoid deeply nested queries**: Flatten query structures when possible
6. **Fetch only needed data**: Use API parameters to limit response size
7. **Handle loading and error states**: Always provide appropriate UI feedback

## Anti-Patterns to Avoid

- Do not use `useEffect` to fetch data - use queries instead
- Do not store server state in local state (`useState`)
- Do not forget to handle loading and error states
- Do not create overly specific query keys that prevent cache reuse
- Do not skip cache invalidation after mutations
- Do not ignore the `enabled` option for conditional queries
