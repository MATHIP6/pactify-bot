# Pactify Bot

A Discord bot for the Pactify Minecraft server.

## Overview

It's a Discord bot designed to interact with the Minecraft server Pactify.
It fetches information from the Pactify website and provides commands for users to access server-related data.

## Getting Started

### Dependencies

First you need to have the following dependencies installed:

- git
- node.js
- pnpm

### Clone

To clone the repository, run the following command:

```bash
git clone https://github.com/MATHIP6/pactify-bot.git
```

Then navigate to the cloned directory to install the dependencies:

```bash
pnpm install
```

After that, you need to create a `.env` file in the root directory of the project with the following content:

```env
DISCORD_TOKEN=your_discord_bot_token
DISCORD_CLIENT_ID=your_discord_client_id
COOKIES=website_cookies
TOKEN=website_token
```

Now, you can run the bot using the following command:

```bash
pnpm dev
```
