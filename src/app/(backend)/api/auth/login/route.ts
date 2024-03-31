import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcrypt";
import { generateCookie, generateToken } from "@/utils/jwt";
import { LoginZodSchema } from "@/utils/zodSchema";
import { db } from "@/utils/db";

export async function POST(req:NextRequest) {
    try {
        const body = await req.json()
        const {email, password: passwordSchema} = LoginZodSchema.parse(body)

        const existingUser = await db.user.findUnique({
            where: {email}
        })

        if (!existingUser) {            
            return NextResponse.json({user: null, message: 'User not found please register'},{status: 404})
        }
        const checkPassword = await compare(
            passwordSchema,
            existingUser.password
        );

        if (!checkPassword) {
            return NextResponse.json({user: null, message: "Incorrect password"},{status: 404})
        }
  
        const { password, ...userWithoutPass } = existingUser;

        const token = await generateToken(userWithoutPass);
        const cookie = generateCookie(token)

        return NextResponse.json({user: userWithoutPass},{
            status: 200,
            headers: {
                'Set-Cookie' : cookie
            }
        })
    } catch (error) {
        return NextResponse.json({user: null, message: error},{status: 500})
    }
}
