import { customAxiosServer, getCookieData } from "@/axios/axiosServer";

export default async function Home() {
  const cookieData = await getCookieData()
  try {
    const res = await customAxiosServer.get('/api/posts', {
      headers: {
        cookie: cookieData as any
      }
    })
    console.log(res.data);
    return <main className="min-h-screen">
         Home {res.data.message}
         {/* <button onClick={po}>send</button> */}
       </main>
  } catch (error: any) {
    console.log(error);
    return <div>noo</div>
    // if (error && error.response) {
    //   console.log(error.response.data);
    // }
  }
}
