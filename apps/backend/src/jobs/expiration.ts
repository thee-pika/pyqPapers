
import cron from "node-cron";
import { updateEXpiredUrls } from "../services/urlService.js";

cron.schedule("0 0 * * *", async () => {
 
    console.log('Running scheduled task to check for expired URLs...');
    await updateEXpiredUrls();
});
