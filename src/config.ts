import dotenv from "dotenv";

dotenv.config();

const { DISCORD_TOKEN, DISCORD_CLIENT_ID } = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID) {
  throw new Error("Missing environment variables");
}

export const config = {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
};

export const header = {
  cookies: "_ga_LXRYMWQJ15=GS1.1.1741475759.1.0.1741475759.0.0.0; _sid=195780b3ede.PH/hbBlqFcnbq/P2; _ga=GA1.2.477736357.1741475760; _gid=GA1.2.1492247688.1741475760",
  token: "6aa2f1baf5a6764af309596bac4cc1ba",
}
