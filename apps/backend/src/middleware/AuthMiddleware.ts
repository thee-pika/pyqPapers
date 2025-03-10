import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface JwtPayloadCustom {
    userId: string;
}

export const AuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const header = req.headers.authorization;
        const token = header?.split(" ")[1];

        if (!token) {
            res.status(401).json({ message: "Token not provided" });
            return
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as JwtPayloadCustom;
        if (!decoded) {
            res.status(403).json({ message: "Invalid Token" });
            return
        }

        req.userId = decoded.userId;
    } catch (error) {
        console.log('error', error);
    }
}
