import { prisma } from "db/client";
import { getPresignedUrl } from "./s3Service.js";

export const updateEXpiredUrls = async () => {
  const expiredEntries = await prisma.pyqPaper.findMany({
    where: {
      expiryDate: {
        lt: new Date(new Date().getTime() - 23 * 60 * 60 * 1000),
      },
    },
  });

  if (expiredEntries.length === 0) {
    console.log("No expired URLs to update");
    return;
  }

  for (const entry of expiredEntries) {
    if (!entry) {
      return;
    }
    const url = await  getPresignedUrl(entry.imageUrl!);

    await prisma.pyqPaper.update({
        where: {
            id: entry.id
        },
        data: {
            psurl: url
        }
    });

    console.log("signed urlk are updated ...........")
  }
};
