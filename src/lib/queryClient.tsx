'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // Cấu hình tuỳ theo dự án, có thể để mặc định
                        staleTime: 60 * 1000, // 1 phút cache cho data mới
                        refetchOnWindowFocus: false, // tắt tính năng auto refetch khi switch tab
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
