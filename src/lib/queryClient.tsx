'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                        refetchOnWindowFocus: false,
                        retry: (failureCount, error: any) => {
                            // Không retry cho 401/403 — lỗi quyền không có ý nghĩa khi retry
                            if (error?.status === 401 || error?.status === 403) return false;
                            return failureCount < 2;
                        },
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient} >
            {children}
        </QueryClientProvider>
    );
}
