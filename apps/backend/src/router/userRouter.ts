import express from "express";
import { prisma } from "db/client";
import { LoginSchema, SignupSchema } from "types/types";
import { createTokens, hashPassword, verifyPassword } from "../controller/userController";

export const authRouter = express();

authRouter.post("/login", async (req, res) => {

    const parsedData = await LoginSchema.safeParse(req.body);

    if (!parsedData.success) {
        res.status(400).json({ message: "validation Failed!!" });
        return
    }

    const userExists = await prisma.user.findFirst({
        where: {
            email: parsedData.data.email
        }
    });

    if (!userExists) {
        res.status(400).json({ message: "Invalid credentials" });
        return
    }

    const hashedPassword = await verifyPassword(parsedData.data.password, userExists.password);

    if (!hashPassword) {
        res.status(400).json({ message: "Invalid credentials" });
        return
    }

    const { access_token, refresh_token } = createTokens(userExists.id);

    await prisma.user.update({
        where: {
            id: userExists.id
        },
        data: {
            refresh_token
        }
    })

    res.json({ access_token })
});

authRouter.post("/signup", async (req, res) => {
    try {

        const parsedData = await SignupSchema.safeParse(req.body);

        if (!parsedData.success) {
            res.status(400).json({ message: "validation Failed!!" });
            return
        }

        const hashedPassword = await hashPassword(parsedData.data.password);

        const user = await prisma.user.create({
            data: {
                username: parsedData.data.username,
                email: parsedData.data.email,
                role: parsedData.data.role,
                password: parsedData.data.password,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        })

        res.json({ message: "user craeted successfully", userId: user.id })
    } catch (error) {
        res.status(500).json({ message: "error occurd", error })
    }
});