import { useRouter } from "next/navigation"
import { toast } from "sonner"

export const useAuth = () => {
    const router = useRouter()//now we can use api

    const signOut = async () => {// fetch request
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/isers/logout`,

            {
                method : 'POST',
            credentials: 'include',
            headers: {
                'Content-Type':'application/json',
            },
        }
    )//cms provide which will invalidate the token from the response and user log out ho jayega
      if (!res.ok) throw new Error()
        
        toast.success("Signed out successfully")

        router.push("/sign-in")

        router.refresh()
        } catch (error) {
            toast.error("Couldn't sign out, please try again.")
        }
    }
    return {signOut}
}