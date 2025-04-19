const functions = require("firebase-functions");
const admin = require("firebase-admin");
const blockchainHandler = require("./functions/handleBlockchainAction");
const { sendDiscordMessage } = require("./functions/discordNotifier");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize Firebase Admin SDK
admin.initializeApp();

// Configure CORS
const cors = require('cors')({ origin: true });

// Enhanced blockchain API endpoint with better error handling and logging
exports.api = functions.https.onRequest((req, res) => {
  // Apply CORS headers
  return cors(req, res, async () => {
    // Only allow POST requests for this API
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed. Please use POST." });
    }
    
    try {
      // Log incoming request for debugging (excluding sensitive data)
      console.log(`[API Request] Action: ${req.body.action}`);
      
      // Validate required fields based on action
      const { action } = req.body;
      if (!action) {
        return res.status(400).json({ error: "Missing required field: action" });
      }
      
      // Process blockchain action
      const result = await blockchainHandler.handleBlockchainAction(req.body);
      
      // If operation was successful, optionally notify on Discord
      if (!result.error && process.env.ENABLE_NOTIFICATIONS === 'true') {
        await sendDiscordMessage(`Blockchain action successful: ${action}`);
      }
      
      return res.json({
        success: !result.error,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      // Log detailed error for server debugging
      console.error("Blockchain Error:", error);
      
      // Send simplified error to client
      return res.status(500).json({
        success: false,
        error: error.message || "An unexpected error occurred",
        code: error.code || "UNKNOWN_ERROR"
      });
    }
  });
});

// Health check endpoint
exports.status = functions.https.onRequest((req, res) => {
  return res.status(200).json({ 
    status: "healthy", 
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString()
  });
});