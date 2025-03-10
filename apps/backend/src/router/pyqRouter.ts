import express from "express";
import { prisma } from "db/client";
import { createPyqPaper } from "types/types";
import { AuthMiddleware } from "../middleware/AuthMiddleware";

export const pyqRouter = express();

pyqRouter.post("/", AuthMiddleware, async (req, res) => {
    try {
        const parsedData = createPyqPaper.safeParse(req.body);

        if (!parsedData.success) {
            res.status(400).json({ message: "validation Failed!!" });
            return
        }

        const newPyqPaper = await prisma.pyqPaper.create({
            data: {
                title: parsedData.data.title,
                year: parsedData.data.year,
                type: parsedData.data.type,
                semester: parsedData.data.semester,
                group: parsedData.data.DegreeGroup,
                subject: parsedData.data.subject,
                userId: parsedData.data.userId
            }
        })

        res.send({ newPyqPaper })
    } catch (error) {
        res.status(500).json({ message: "error occurd", error });
    }
})

pyqRouter.get("/", async (req, res) => {
    try {
        const allPyqPaper = await prisma.pyqPaper.findMany();

        res.send({ allPyqPaper })
    } catch (error) {
        res.status(500).json({ message: "error occurd", error });
    }
})

pyqRouter.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(500).json({ message: "id not found!!" });
            return;
        }

        const pyqPaper = await prisma.pyqPaper.findFirst({
            where: {
                id
            }
        })

        if (!pyqPaper) {
            res.status(500).json({ message: "no paper found!!" });
            return;
        }

        res.send({ pyqPaper });

    } catch (error) {
        res.status(500).json({ message: "error occurd", error });
    }
})

pyqRouter.put("/:id", AuthMiddleware, async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(500).json({ message: "id not found!!" });
            return;
        }

        const pyqPaper = await prisma.pyqPaper.findFirst({
            where: {
                id
            }
        })

        if (!pyqPaper) {
            res.status(500).json({ message: "no paper found!!" });
            return;
        }

        const updates = req.body;
        const updatedPaper = await prisma.pyqPaper.update({
            where: {
                id
            },
            data: updates
        });

        res.send({ updatedPaper });

    } catch (error) {
        res.status(500).json({ message: "error occurd", error });
    }
})

pyqRouter.delete("/:id", AuthMiddleware, async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(500).json({ message: "id not found!!" });
            return;
        }

        const pyqPaper = await prisma.pyqPaper.findFirst({
            where: {
                id
            }
        })

        if (!pyqPaper) {
            res.status(500).json({ message: "no paper found!!" });
            return;
        }

        await prisma.pyqPaper.delete({
            where: {
                id
            }
        })

        res.send({ message: "pyqPaper deleted successfully!!" });

    } catch (error) {
        res.status(500).json({ message: "error occurd", error });
    }
})