import { z } from "zod";

export const LoginSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    role: z.enum(["user", "admin"]),
    password: z.string().min(6),
    createdAt: z.date(),
    updatedAt: z.date()
})

export const createPyqPaper = z.object({
    title: z.string(),
    year: z.number(),
    type: z.enum([
        "underGraduation",
        "postGraduation"
    ]),
    semester: z.enum(["1", "2", "3", "4", "5", "6"]),
    DegreeGroup: z.enum([
        "BSC",
        "BCom",
        "BA",
        "MSc",
        "MA",
        "MBA",
        "PhD",
        "Diploma"
    ]),
    subject: z.enum([
        "Mathematics_BSC",
        "Physics_BSC",
        "Chemistry_BSC",
        "Biology_BSC",
        "Computer Science_BSC",
        "Accounting_BCom",
        "Economics_BCom",
        "Business Studies_BCom",
        "Finance_BCom",
        "Taxation_BCom", "History_BA",
        "Political Science_BA",
        "Psychology_BA",
        "Sociology_BA",
        "English Literature_BA",
        "Philosophy_MA",
        "Linguistics_MA",
        "Fine Arts_MA",
        "Literature_MA",
        "Cultural Studies_MA",
        "Marketing_MBA",
        "Machine Learning_PhD",
    ]),
    userId: z.string()
})
