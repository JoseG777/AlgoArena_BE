import jwt from "jsonwebtoken";

export type AccessClaims = {
    sub: string;
    email: string;
    username: string;
};

const ACCESS_DURATION = 60 * 60; // 1 hour

export function signAccess(claims: AccessClaims) : string {
    return jwt.sign(claims, process.env.JWT_SECRET!, {
        algorithm: "HS256",
        expiresIn: ACCESS_DURATION
    })
}

export function verifyAccess(token: string) : AccessClaims {
    return jwt.verify(token, process.env.JWT_SECRET!) as AccessClaims;
}