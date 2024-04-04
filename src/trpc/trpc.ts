//serves as the end point for the backend(Router)

import { ExpressContext } from "@/server";
import { initTRPC } from "@trpc/server";


const t = initTRPC.context<ExpressContext>().create()

export const router = t.router
export const publicProcedure =t.procedure