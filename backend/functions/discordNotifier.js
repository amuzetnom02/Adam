const fetch = require("node-fetch");

/**
 * Sends a message to Discord using a webhook
 * @param {string} message - The message to send to Discord
 * @returns {Promise<void>}
 */
exports.sendDiscordMessage = async (message) => {
  const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK;

  if (!DISCORD_WEBHOOK_URL) {
    console.warn("Discord webhook URL not configured");
    return;
  }

  try {
    await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message })
    });
    console.log("Discord notification sent successfully");
  } catch (err) {
    console.error("Discord post failed:", err);
  }
};