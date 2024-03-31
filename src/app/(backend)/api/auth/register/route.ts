import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";
import { UserZodSchema } from "@/utils/zodSchema";
import { db } from "@/utils/db";
import { generateCookie, generateToken } from "@/utils/jwt";

export async function POST(req:NextRequest) {
    try {
        const body = await req.json()
        const validation = UserZodSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json({user: null, message: validation.error.errors[0].message},{status: 400})
        }
        const {username, email, password}  = body;
        const isEmailExists = await db.user.findUnique({
            where: {email}
        })
        if (isEmailExists) {            
            return NextResponse.json({user: null, message: 'User with this email is exists'},{status: 400})
        }
        const isUserNameExists = await db.user.findUnique({
            where: {username}
        })
        if (isUserNameExists) {
            return NextResponse.json({user: null, message: 'User with this username is exists'},{status: 400})
        }
        const encryptPassword = await hash(password , 10)

        const newUser = await db.user.create({
            data: {username, email, password: encryptPassword}
        })
        
        const {password: newPassword, ...restUser} = newUser

        const token = await generateToken(restUser)
        const cookie = generateCookie(token)
        
        return NextResponse.json({user: restUser, message: 'Created seccesfuly'},{
            status: 201,
            headers: {
                'Set-Cookie' : cookie
            }
        })
    } catch (error) {
        return NextResponse.json({user: null, message: JSON.stringify(error)},{status: 500})
    }
}
