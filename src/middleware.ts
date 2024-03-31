import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./utils/jwt";


export async function middleware(request: NextRequest) {
    const token = request.cookies.get('authToken')?.value as string
   
    const { url } = request;
    if (url.indexOf('/auth') === -1) {
        if (!token) {
            return NextResponse.json(
                {message: 'Please enter token'},
                {status: 400}
            )
        }
        const to = await verifyToken(token)
        if (!to) {
            return NextResponse.json({
                message: 'Token is invalid'
            }, {status: 400})
        }
    }
}

export const config = {
    matcher: ["/api/:path*"]
}