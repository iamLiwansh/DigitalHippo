import express from "express"
import { getPayloadClient } from "./get-payload"
import { nextApp, nextHandler } from "./next-utils"
import * as trpcExpress from "@trpc/server/adapters/express"
import { appRouter } from "./trpc"
import { inferAsyncReturnType } from "@trpc/server"
import bodyParser from 'body-parser'
import { IncomingMessage } from "http"
import { stripeWebhookHandler } from "./webhooks"
import nextBuild from "next/dist/build"
import path from "path"
import { parse } from 'url'
import { PayloadRequest } from "payload/types"


const app = express()
const PORT = Number(process.env.PORT) || 3000

const createContext = ({req , res} : trpcExpress.CreateExpressContextOptions) => ({
    req,
    res,
})

export type ExpressContext = inferAsyncReturnType<typeof createContext>

export type WebhookRequest = IncomingMessage & {rawBody: Buffer}

const start = async () => {

    const webhookMiddleware = bodyParser.json({
        verify: (req: WebhookRequest, _, buffer) => {
            req.rawBody = buffer
        }
    })
    app.post("/api/webhooks/stripe", webhookMiddleware, stripeWebhookHandler)

    const payload = await getPayloadClient({//this is the admin dashboard statup(we can also use a db client to fetch or add data into the database)
        initOptions:{
            express: app,
            onInit: async (cms) => {
                cms.logger.info(`admin URL ${cms.getAdminURL()}`)
            }
        }
    })

    const cartRouter = express.Router()

    cartRouter.use(payload.authenticate)

    cartRouter.get('/', (req, res) => {
        const request = req as PayloadRequest
    
        if (!request.user)
          return res.redirect('/sign-in?origin=cart')
    
        const parsedUrl = parse(req.url, true)
        const { query } = parsedUrl
    
        return nextApp.render(req, res, '/cart', parsedUrl.query)
      })

      app.use('/cart', cartRouter)

    if(process.env.NEXT_BUILD){
        app.listen( async () => {
            payload.logger.info("Next.js is building for production")
            //@ts-expect-error
            await nextBuild(path.join(__dirname,"../"))

            process.exit()
        })
        return
    }
   

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