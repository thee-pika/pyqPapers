import express from "express";
import { prisma } from "db/client";
import { LoginSchema, signupSchema } from "types/types";
import {
  createTokens,
  hashPassword,
  verifyPassword,
} from "../../controller/userController.js";

export const authRouter = express();

authRouter.post("/login", async (req, res) => {
  const parsedData = await LoginSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(400).json({ message: "validation Failed!!" });
    return;
  }

  const userExists = await prisma.user.findFirst({
    where: {
      email: parsedData.data.email,
    },
  });

  if (!userExists) {
    res.status(400).json({ message: "Invalid credentials" });
    return;
  }

  const hashedPassword = await verifyPassword(
    parsedData.data.password,
    userExists.password
  );

  if (!hashedPassword) {
    res.status(400).json({ message: "Invalid credentials" });
    return;
  }

  const { access_token, refresh_token } = createTokens(userExists.id);

  const user = await prisma.user.update({
    where: {
      id: userExists.id,
    },
    data: {
      refresh_token,
    },
  });

  res.json({ access_token , role: user.role});
});

authRouter.post("/signup", async (req, res) => {
  try {
    const parsedData = await signupSchema.safeParse(req.body);
    console.log("parsedData", parsedData);
    if (!parsedData.success) {
      console.log("parsedData", parsedData.error);
      res
        .status(400)
        .json({ message: "validation Failed!!", error: parsedData.error });
      return;
    }

    const hashedPassword = await hashPassword(parsedData.data.password);

    const user = await prisma.user.create({
      data: {
        username: parsedData.data.username,
        email: parsedData.data.email,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    res.json({ message: "user craeted successfully", userId: user.id });
  } catch (error) {
    res.status(500).json({ message: "error occurd", error });
  }
});
