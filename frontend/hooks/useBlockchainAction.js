import { auth, db } from "../firebase";
import axios from "axios";

export const useBlockchainAction = () => {
  // Unified blockchain action handler for frontend
  const handle = async (params) => {
    try {
      const { data } = await axios.post("/api/blockchain", params);
      return data;
    } catch (err) {
      // Enhanced error handling
      if (err.response && err.response.data && err.response.data.error) {
        return { error: err.response.data.error };
      }
      return { error: err.message || "Unknown error" };
    }
  };
  return { handle };
};