import { Request, Response, NextFunction } from "express";
import { verifyAccess, AccessClaims } from "../lib/jwt";

export interface AuthenticatedRequest extends Request {
    user: AccessClaims;
}

export function requireAuth(req: Request, res: Response, next: NextFunction)
{
    const token = req.cookies.access;
    if(!token)
    {
        return res.status(401).json({
            error: "Missing access token!"
        })
    }

    try{
        const claims = verifyAccess(token);

        (req as Request & { user?: AccessClaims }).user = claims;

        return next();
    }
    catch(e){

    }
}