import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { auth } from "../firebase";

// Create a new user with email and password
export const registerUser = async (email, password, displayName = "") => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile if display name is provided
    if (displayName) {
      await updateProfile(userCredential.user, {
        displayName: displayName
      });
    }
    
    console.log("User created:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Error creating user:", error.message);
    throw error;
  }
};

// Sign in existing user
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User signed in:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in:", error.message);
    throw error;
  }
};

// Sign out user
export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
    return true;
  } catch (error) {
    console.error("Error signing out:", error.message);
    throw error;
  }
};

// Subscribe to auth state changes
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};