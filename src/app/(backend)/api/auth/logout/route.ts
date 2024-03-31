import { nameCookie } from "@/utils/jwt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";



export function GET() {
    try {
        cookies().delete(nameCookie)
        return NextResponse.json(
            {message: 'loguot'},
            {status: 200}
        )
    } catch (error) {
        return NextResponse.json(
            { message: "server error" },
            { status: 500 }
        )
    }
}