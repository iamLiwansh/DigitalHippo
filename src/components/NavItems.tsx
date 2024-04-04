"use client"

import { PRODUCT_CATEGORIES } from "@/config"
import { KeyboardEvent, useEffect, useRef, useState } from "react"
import NavItem from "./Navitem"
import { useOnClickOutside } from "@/hooks/use-on-click-outside"

const NavItems = () => {

    const [activeIndex , setActiveIndex] = useState<null | number>(null)


    useEffect(() => {
        const handler: EventListenerOrEventListenerObject = (e: Event) => {
            if ((e as unknown as KeyboardEvent).key === "Escape") {
                setActiveIndex(null); // close the navbar when the ESC key is pressed
            }
        };
    
        document.addEventListener("keydown", handler);
    
        // Cleanup function to remove the event listener when component unmounts
        return () => {
            document.removeEventListener("keydown", handler);
        };
    }, []); 
    

    const isAnyOpen = activeIndex !== null //null ko chrd ke kuch bhi value hui (isAnyOpen koi or navbar mai khula hua hai kya)

    const navRef = useRef<HTMLDivElement | null>(null)

    useOnClickOutside(navRef,() => setActiveIndex(null))

    
    return <div className=" flex gap-4 h-full" ref={navRef}>

        {PRODUCT_CATEGORIES.map((category,i) => {
            const handleOpen = () => {
                if(activeIndex === i){
                    setActiveIndex(null)
                }else{
                    setActiveIndex(i)
                }
            }

            const isOpen = i === activeIndex
            return(
                <NavItem
                    category={category}
                    handleOpen={handleOpen}
                    isOpen = {isOpen}
                    key={category.value}
                    isAnyOpen={isAnyOpen}
                />
            )
        })}
    </div>
}

export default NavItems