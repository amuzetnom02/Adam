// functions/handleBlockchainAction.js
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const sdk = ThirdwebSDK.fromWallet(wallet, "base"); // or polygon, ethereum, etc.

export async function handleBlockchainAction(data) {
  const {
    action,
    walletAddress,
    tokenAddress,
    tokenId,
    receiver,
    amount,
    contractFunction,
    functionArgs = []
  } = data;

  try {
    switch (action) {
      case "checkBalance": {
        const balance = await provider.getBalance(walletAddress);
        return { balance: ethers.formatEther(balance) };
      }

      case "checkNFT": {
        const contract = await sdk.getContract(tokenAddress);
        const is1155 = !!contract.erc1155;
        const balance = is1155
          ? await contract.erc1155.balanceOf(walletAddress, tokenId)
          : await contract.erc721.balanceOf(walletAddress);
        return { ownsNFT: parseInt(balance.toString()) > 0 };
      }

      case "mintNFT": {
        const contract = await sdk.getContract(tokenAddress);
        const tx = await contract.erc721.mintTo(walletAddress, {
          name: "Serum NFT",
          description: "Issued by Adam."
        });
        return { transactionHash: tx.receipt.transactionHash };
      }

      case "sendTransaction": {
        const tx = await wallet.sendTransaction({
          to: receiver,
          value: ethers.parseEther(amount)
        });
        return { transactionHash: tx.hash };
      }

      case "getTokenMetadata": {
        const contract = await sdk.getContract(tokenAddress);
        const metadata = await contract.metadata.get();
        return metadata;
      }

      case "getNFTMetadata": {
        const contract = await sdk.getContract(tokenAddress);
        const metadata = await contract.erc721.get(tokenId);
        return metadata;
      }

      case "deployContract": {
        const contractAddress = await sdk.deployer.deployNFTCollection({
          name: "Serum Collection",
          symbol: "S3",
          primary_sale_recipient: walletAddress
        });
        return { contractAddress };
      }

      case "getENS": {
        const ens = await provider.lookupAddress(walletAddress);
        return { ens };
      }

      case "getDAOVotes": {
        const contract = await sdk.getContract(tokenAddress);
        const proposals = await contract.call("getAllProposals"); // Ensure this function exists
        return { proposals };
      }

      case "callContractFunction": {
        const contract = await sdk.getContract(tokenAddress);
        const result = await contract.call(contractFunction, functionArgs);
        return { result };
      }

      default:
        return { error: `Unknown action: ${action}` };
    }
  } catch (err) {
    console.error(`[Blockchain Error][${action}]`, err);
    return { error: err.message || "An unexpected error occurred." };
  }
}
