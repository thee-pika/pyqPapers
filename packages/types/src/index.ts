import { z } from "zod";

export const signupSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
})

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export const createPyqPaper = z.object({
    title: z.string(),
    year: z.number(),
    semester: z.enum([
        "SEM1",
        "SEM2",
        "SEM3",
        "SEM4",
        "SEM5",
        "SEM6",
    ]),
    combination: z.enum([
        "BSC",
        "BCom",
        "BBA",
        "BA",
        "BZC",
        "BCA",
        "NCZ"
    ]),
    subject: z.enum([
        "Mathematics_BSC",
        "Physics_BSC",
        "Chemistry_BSC",
        "Biology_BSC",
        "ComputerScience_BSC",
        "Accounting_BCom",
        "Economics_BCom",
        "BusinessStudies_BCom",
        "Finance_BCom",
        "Taxation_BCom",
         "History_BA",
        "PoliticalScience_BA",
        "Psychology_BA",
        "Sociology_BA",
        "EnglishLiterature_BA",
        "Philosophy_MA",
        "Linguistics_MA",
        "FineArts_MA",
        "Literature_MA",
        "CulturalStudies_MA",
        "Marketing_MBA",
        "MachineLearning_PhD",
    ]),
})
