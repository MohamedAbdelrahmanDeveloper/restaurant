import { serialize } from "cookie";
import * as jose from 'jose'


export const nameCookie:string = 'authToken'
export const timeToken = 60 * 60 * 24 * 30

export async function generateToken(payload: {}): Promise<string> {
  const secret_key = process.env.SECRET_KEY;
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + timeToken; // one hour

  return new jose.SignJWT({ payload })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setExpirationTime(exp)
      .setIssuedAt(iat)
      .setNotBefore(iat)
      .sign(new TextEncoder().encode(secret_key));
}


export async function verifyToken(token: string): Promise<jose.JWTPayload | null> {
  try {
    const secret_key = process.env.SECRET_KEY;
    const { payload } = await jose.jwtVerify(token, new TextEncoder().encode(secret_key));
    // run some checks on the returned payload, perhaps you expect some specific values
    // if its all good, return it, or perhaps just return a boolean
    return payload;
  } catch (error) {
    return null
  }
}

export function generateCookie(token: string): string{
  const cookie: string = serialize(nameCookie, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: timeToken
  })
  return cookie
}