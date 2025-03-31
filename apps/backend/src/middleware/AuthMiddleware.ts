import { prisma } from "db/client";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface JwtPayloadCustom {
  userId: string;
}

export const AuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const header = req.headers.authorization;
    const token = header?.split(" ")[1];
    console.log("im heere at AuthMiddleware");
    if (!token) {
      res.status(401).json({ message: "Token not provided" });
      return;
    }

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
  } catch (error) {
    console.log("error", error);
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
