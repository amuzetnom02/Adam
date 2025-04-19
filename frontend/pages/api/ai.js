import { Configuration, OpenAIApi } from "openai";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(config);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { prompt } = req.body;

  try {
    const systemPrompt = `You are a developer assistant for a blockchain console. Based on the user prompt, return a JSON with the following format:

{
  "action": "checkBalance",
  "walletAddress": "0x...",
  "tokenAddress": "",
  "tokenId": "",
  "receiver": "",
  "amount": "",
  "contractFunction": "",
  "functionArgs": []
}

Only return valid actions from this list:
["checkBalance", "checkNFT", "mintNFT", "sendTransaction", "getTokenMetadata", "getNFTMetadata", "deployContract", "getENS", "getDAOVotes", "callContractFunction"]`;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo", // or "gpt-4" if you have access
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ]
    });

    const parsed = JSON.parse(response.data.choices[0].message.content);
    res.status(200).json(parsed);
  } catch (err) {
    console.error("AI Error:", err);
    res.status(500).json({ error: err.message });
  }
}