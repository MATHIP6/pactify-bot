import dotenv from "dotenv";

dotenv.config();

const { DISCORD_TOKEN, DISCORD_CLIENT_ID, COOKIES, TOKEN } = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID || !COOKIES || !TOKEN) {
  throw new Error("Missing environment variables");
}

export const config = {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
};

export const header = {
  cookies:
    COOKIES,
  token: TOKEN,
};
