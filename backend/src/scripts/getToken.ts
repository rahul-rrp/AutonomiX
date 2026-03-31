import { google } from "googleapis";
import "dotenv/config";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI,
);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: [
    "https://mail.google.com/",
    "https://www.googleapis.com/auth/calendar",
  ],
});

console.log("\nVisit this URL in browser:\n");
console.log(authUrl);
