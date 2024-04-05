

import dotenv from "dotenv"//dotenv used for storing senstive data or ye github pe push bhi nhi hota
import path from "path"
import type {InitOptions} from "payload/config"
import payload, { Payload } from"payload"
import nodemailer from "nodemailer"

dotenv.config({
    path: path.resolve(__dirname,"../.env")//take this directory=>(__dirname says current dircotory) then go back to ../ directory and find .env 
})
// configration for sending the email
const transporter = nodemailer.createTransport({
    host:"smtp.resend.com",
    secure :true,
    port : 465,//standard port for email (secure)
    auth:{
        user: "resend",
        pass: process.env.RESEND_API_KEY
    }
})

//in production we used to store data
let cached = (global as any).payload//agar cached hai

if(!cached){
    cached = (global as any).payload ={
        client:null,
        promise:null,
    }
}//agar nhi hai

interface Args{
    initOptions?: Partial<InitOptions>
}
export const getPayloadClient = async ({initOptions}: Args ={}): Promise<Payload> =>  {
    if(!process.env.PAYLOAD_SECRET){
        throw new Error('PAYLOAD_SECRET is missing')
    }
    if(cached.client){
        return cached.client
    }
    if(!cached.promise){
        cached.promise =payload.init({
            email: {
                transport: transporter,
                fromAddress: "onboarding@resend.dev",//if in case doesnt work use onboarding@resend.com
                fromName: "DigitalHippo"
            },
            secret:process.env.PAYLOAD_SECRET,
            local: initOptions?.express ? false : true,
            ...(initOptions || {}),
        })
    }
    try{
        cached.client = await cached.promise
    } catch(e : unknown){
        cached.promise = null
        throw e
    }

    return cached.client
}
//overview - we created a dbclient now we can use in entire app and we also store to cache the info.
//we can directly use getPayload for dbclient