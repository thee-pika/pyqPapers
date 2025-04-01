import { prisma } from "db/client";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getRefreshTokens } from "../controller/userController.js";

interface JwtPayloadCustom {
  userId: string;
}

export const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  const token = header?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Token not provided" });
    return;
  }

  try {
    console.log("im heere at AuthMiddleware");

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as JwtPayloadCustom;

    if (!decoded) {
      res.status(403).json({ message: "Invalid Token" });
      return;
    }

    req.userId = decoded.userId;
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      const decoded = jwt.decode(token) as { userId: string };

      const user = await prisma.user.findFirst({
        where: {
          id: decoded.userId,
        },
      });

      const refreshToken = user?.refresh_token;

      if (!refreshToken) {
        res.status(403).json({ message: "NO Token Found" });
        return;
      }
      
      await getRefreshTokens(refreshToken);

      req.userId = decoded.userId!;
      next();
    }
  }
};

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;
    console.log("im heere at isAdmin");
    if (!userId) {
      res.status(401).json({ message: "Unauthorized. User ID not found." });
      return;
    }

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      res.status(401).json({ message: "Unauthorized. User not found." });
      return;
    }

    if (user.role === "Admin") {
      next();
      return;
    }

    res.status(403).json({ message: "Forbidden. Admin access required." });
    return;
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error occurred during admin check.", error });
    return;
  }
};
