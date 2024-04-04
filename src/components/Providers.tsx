
"use client"

import {  PropsWithChildren, useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { trpc } from "@/trpc/client"
import { httpBatchLink } from "@trpc/client"

//this Provider function will help to use tRPC in entire fronted part
const Providers = ({children} : PropsWithChildren) => {
    const [queryClient] = useState(() => new QueryClient())
    const [trpcClient] = useState(() => trpc.createClient({
        links: [
            httpBatchLink({
                url: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/trpc`,//url for the backend to be called
                fetch(url, options){
                    return fetch(url, {
                        ...options,
                        credentials: 'include',
                    })
                }
            })//Batch request together for maximize performance 
        ]
    }))
    return(// eska kuch role nh hai trpc se eska sirf ye kam hai ki ye tanstack react-query indepently form trpc
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </trpc.Provider>
    )
}

export default Providers