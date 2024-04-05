// to get user from server to update the site as per it

import { User } from "../payload-types";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { NextRequest } from "next/server";

export const getServerSideUser = async (
    cookies: NextRequest["cookies"] | ReadonlyRequestCookies
) => {
    const token = cookies.get("payload-token")?.value

    const meRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`,{// this is a end point to find our info (automaticly created by cms)
        headers:{
            Authorization: `JWT ${token}`,
        },
    }

)
    const {user} = (await meRes.json()) as {user: User | null}

    return {user}
}