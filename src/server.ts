import express from "express"
import { getPayloadClient } from "./get-payload"
import { nextApp, nextHandler } from "./next-utils"
import * as trpcExpress from "@trpc/server/adapters/express"
import { appRouter } from "./trpc"
import { inferAsyncReturnType } from "@trpc/server"


const app = express()
const PORT = Number(process.env.PORT) || 3000

const createContext = ({req , res} : trpcExpress.CreateExpressContextOptions) => ({
    req,
    res,
})

export type ExpressContext = inferAsyncReturnType<typeof createContext>
const start = async () => {
    const payload = await getPayloadClient({//this is the admin dashboard statup(we can also use a db client to fetch or add data into the database)
        initOptions:{
            express: app,
            onInit: async (cms) => {
                cms.logger.info(`admin URL ${cms.getAdminURL()}`)
            }
        }
    })

    app.use('/api/trpc', trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext//getting arguments from express like res,req and then attach them to context to use them in next
    }))
    app.use((req,res) => nextHandler(req, res))

    nextApp.prepare().then(()=>{
        payload.logger.info('Next.js Started')

        app.listen(PORT, async () => {
            payload.logger.info(`Next.js App URL: ${process.env.NEXT_PUBLIC_SERVER_URL}`)
        })
    })
}

start()