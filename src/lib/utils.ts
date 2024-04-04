import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(
  price: number | string,
  options :{
    currency?: "USD" | "EUR" | "GBP" | "BDT"//we can add INR also
    notation?: Intl.NumberFormatOptions["notation"]//? edhar denote krta hai ki optional hai
  } = {}
){
  const {currency ="USD" /*default value change to INR */, notation="compact"} = options
  
  const numericPrice = typeof price ==="string" ? parseFloat(price) : price

  return new Intl.NumberFormat("en-US",{
    style: "currency",
    currency,
    notation,
    maximumFractionDigits:2
  }).format(numericPrice)
}