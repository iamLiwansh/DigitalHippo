import { authRouter } from "./auth-router";
import { publicProcedure, router } from "./trpc";

export const appRouter = router({
    auth : authRouter,
})//custom type safe end point

export type AppRouter = typeof appRouter