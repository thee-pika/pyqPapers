import { prisma } from "db/client";
import cron from "node-cron";
import { updateEXpiredUrls } from "../services/urlService";

cron.schedule("0 0 * * *", async () => {
 
    console.log('Running scheduled task to check for expired URLs...');
    await updateEXpiredUrls();
});
