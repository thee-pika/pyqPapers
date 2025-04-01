import express from "express";
import { prisma } from "db/client";
import { createPyqPaper } from "types/types";
import { AuthMiddleware, isAdmin } from "../../middleware/AuthMiddleware.js";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { config } from "dotenv";
import { v4 as uuidV4 } from "uuid";
import multer from "multer";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
config();

export const pyqRouter = express();
const upload = multer({ storage: multer.memoryStorage() });

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const S3_BUCKET = process.env.BUCKET;

pyqRouter.post("/get-paper", async (req, res) => {
  try {
    const { combination, subject, semester } = req.body.data;

    const pyqPapers = await prisma.pyqPaper.findMany({
      where: {
        combination,
        subject,
        semester,
      },
    });
 
    if (!pyqPapers) {
      res.status(500).json({ message: "no paper found!!" });
      return;
    }

    res.send({ pyqPapers });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "error occurd", error });
  }
});

pyqRouter.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      res.status(400).json({ message: "File is required." });
      return;
    }

    const id = uuidV4();

    const putcommand = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: `uploads/${id}_${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3Client.send(putcommand);

    const command = new GetObjectCommand({
      Bucket: S3_BUCKET,
      Key: `uploads/${id}_${file.originalname}`,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 86400 });
    res.status(200).json({ url });
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

pyqRouter.post(
  "/",
  AuthMiddleware,
  isAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const file = req.file;

      if (!file) {
        res.status(400).json({ message: "File is required." });
        return;
      }

      const data = JSON.parse(req.body.form);

      const parsedData = createPyqPaper.safeParse(data);

      if (!parsedData.success) {
        res.status(400).json({ message: "validation Failed!!" });
        return;
      }

      const id = uuidV4();

      const putcommand = new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: `uploads/${id}_${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await s3Client.send(putcommand);

      const command = new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: `uploads/${id}_${file.originalname}`,
      });
      const date = new Date();
      console.log("data", data);

      const url = await getSignedUrl(s3Client, command, { expiresIn: 86400 });

      console.log("urllllllllllllll", url);

      const newPyqPaper = await prisma.pyqPaper.create({
        data: {
          title: parsedData.data.title,
          year: parsedData.data.year,
          psurl: url,
          expiryDate: date,
          semester: parsedData.data.semester,
          imageUrl: `uploads/${id}_${file.originalname}`,
          combination: parsedData.data.combination,
          subject: parsedData.data.subject,
          userId: req.userId,
        },
      });

      res.send({ paper: newPyqPaper });
    } catch (error) {
      console.log("error", error);

      res.status(500).json({ message: "error occurd", error });
    }
  }
);

pyqRouter.get("/", async (req, res) => {
  try {
    const allPyqPaper = await prisma.pyqPaper.findMany();

    res.send({ allPyqPaper });
  } catch (error) {
    res.status(500).json({ message: "error occurd", error });
  }
});

pyqRouter.get("/:id", AuthMiddleware, isAdmin, async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      res.status(500).json({ message: "id not found!!" });
      return;
    }

    const pyqPaper = await prisma.pyqPaper.findFirst({
      where: {
        id,
      },
    });

    if (!pyqPaper) {
      res.status(500).json({ message: "no paper found!!" });
      return;
    }

    res.send({ pyqPaper });
  } catch (error) {
    res.status(500).json({ message: "error occurd", error });
  }
});

pyqRouter.put("/:id", AuthMiddleware, isAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    console.log("putttttttttttttttttttt");
    if (!id) {
      res.status(500).json({ message: "id not found!!" });
      return;
    }

    const pyqPaper = await prisma.pyqPaper.findFirst({
      where: {
        id,
      },
    });

    if (!pyqPaper) {
      res.status(500).json({ message: "no paper found!!" });
      return;
    }

    console.log("req bodyyyyyyyyyyyyyyyy", req.body);
    const updates = req.body.data;
    console.log("updates", updates);

    const updatedPaper = await prisma.pyqPaper.update({
      where: {
        id,
      },
      data: updates,
    });

    res.send({ updatedPaper });
  } catch (error) {
    res.status(500).json({ message: "error occurd", error });
  }
});

pyqRouter.delete("/:id", AuthMiddleware, isAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(500).json({ message: "id not found!!" });
      return;
    }

    const pyqPaper = await prisma.pyqPaper.findFirst({
      where: {
        id,
      },
    });

    if (!pyqPaper) {
      res.status(500).json({ message: "no paper found!!" });
      return;
    }

    if (!S3_BUCKET || !pyqPaper.imageUrl) {
      res.status(500).json({ message: "credentials not found!!" });
      return;
    }

    const deleteParams = {
      Bucket: S3_BUCKET,
      Key: pyqPaper.imageUrl,
    };

    await s3Client.send(new DeleteObjectCommand(deleteParams));

    await prisma.pyqPaper.delete({
      where: {
        id,
      },
    });

    res.send({ message: "pyqPaper deleted successfully!!" });
  } catch (error) {
    res.status(500).json({ message: "error occurd", error });
  }
});
