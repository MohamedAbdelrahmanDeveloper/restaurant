import axios from "axios";
import { cookies } from "next/headers";


export const customAxiosServer = axios.create({
    baseURL: process.env.NODE_ENV === 'development' ? "http://192.168.1.10:3000" : process.env.URL_SERVER,
})

export async function getCookieData() {
    const cookieData = cookies()
    return new Promise((resolve) =>
    setTimeout(() => {
          resolve(cookieData)
      }, 1000)
    )
}
