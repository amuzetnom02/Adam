import React, { useState, useEffect } from 'react';
import { useAddress } from "@thirdweb-dev/react";
import { auth, db } from "../firebase";
import { useBlockchainAction } from "../hooks/useBlockchainAction";
import { getCurrentUser } from '../utils/auth';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

export default function DashboardComponent() {
  const [userInfo, setUserInfo] = useState(null);
  const [balanceInfo, setBalanceInfo] = useState(null);
  const [recentActions, setRecentActions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  const address = useAddress();
  const { handle } = useBlockchainAction();
  
  // Fetch user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        // Get user and connected wallet info
        const firebaseUser = getCurrentUser();
        
        if (firebaseUser && address) {
          // Get user details
          const userInfo = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || "Anonymous User",
            walletAddress: address
          };
          
          setUserInfo(userInfo);
          
          // Get wallet balance
          const balanceResult = await handle({
            action: "checkBalance",
            walletAddress: address
          });
          
          setBalanceInfo(balanceResult);
          
          // Get recent actions from Firestore
          const actionsRef = collection(db, "userActions");
          const q = query(
            actionsRef, 
            where("userId", "==", firebaseUser.uid),
            where("timestamp", ">=", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) // Last 7 days
          );
          
          const querySnapshot = await getDocs(q);
          const actions = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          setRecentActions(actions);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [address, handle]);
  
  // Record a new blockchain action
  const recordAction = async (action, details) => {
    try {
      if (!userInfo?.uid) return;
      
      await addDoc(collection(db, "userActions"), {
        userId: userInfo.uid,
        walletAddress: address,
        action,
        details,
        timestamp: serverTimestamp()
      });
      
      // Refresh recent actions
      const actionsRef = collection(db, "userActions");
      const q = query(
        actionsRef, 
        where("userId", "==", userInfo.uid),
        where("timestamp", ">=", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      );
      
      const querySnapshot = await getDocs(q);
      const actions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setRecentActions(actions);
    } catch (error) {
      console.error("Error recording action:", error);
    }
  };
  
  // Execute a simple blockchain action
  const executeAction = async (actionType) => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    setIsLoading(true);
    try {
      let result;
      switch (actionType) {
        case 'refreshBalance':
          result = await handle({
            action: "checkBalance",
            walletAddress: address
          });
          setBalanceInfo(result);
          toast.success("Balance updated successfully");
          break;
        case 'getENS':
          result = await handle({
            action: "getENS",
            walletAddress: address
          });
          toast.success(`ENS lookup: ${result.ens || "No ENS found"}`);
          break;
        default:
          toast.error("Unknown action");
          return;
      }
      
      await recordAction(actionType, result);
    } catch (error) {
      console.error("Error executing blockchain action:", error);
      toast.error("Failed to execute action");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!address) {
    return (
      <div className="min-h-[60vh] bg-[#e0e5ec] rounded-2xl p-8 shadow-neumorph flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">Connect Your Wallet</h2>
        <p className="text-gray-600 mb-8 text-center">
          Please connect your wallet to view your personalized dashboard and access all features.
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-[#e0e5ec] rounded-2xl p-6 shadow-neumorph">
      {/* Dashboard Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-700">
          Dashboard {userInfo?.displayName && `- ${userInfo.displayName}`}
        </h2>
        <p className="text-gray-500 mt-2">
          Connected: {address.substring(0, 6)}...{address.substring(address.length - 4)}
        </p>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex mb-6 border-b border-gray-200">
        <button 
          className={`px-4 py-2 ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'activity' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('activity')}
        >
          Activity
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'actions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('actions')}
        >
          Quick Actions
        </button>
      </div>
      
      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-gray-300 h-16 w-16 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-24"></div>
          </div>
        </div>
      ) : (
        <>
          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Info Card */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="font-medium text-lg mb-4 text-gray-800">Account Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email:</span>
                    <span className="font-medium">{userInfo?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Wallet:</span>
                    <span className="font-medium">{address.substring(0, 6)}...{address.substring(address.length - 4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Balance:</span>
                    <span className="font-medium">{balanceInfo?.balance ? `${parseFloat(balanceInfo.balance).toFixed(4)} ETH` : 'Unknown'}</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats Card */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="font-medium text-lg mb-4 text-gray-800">Activity Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Recent Actions:</span>
                    <span className="font-medium">{recentActions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Activity:</span>
                    <span className="font-medium">
                      {recentActions.length > 0 
                        ? new Date(recentActions[0].timestamp?.seconds * 1000).toLocaleDateString() 
                        : 'No recent activity'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'activity' && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentActions.length > 0 ? (
                    recentActions.map((action) => (
                      <tr key={action.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{action.action}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {action.timestamp ? new Date(action.timestamp.seconds * 1000).toLocaleString() : 'Unknown date'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Completed
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">No recent activity</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          {activeTab === 'actions' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <button 
                onClick={() => executeAction('refreshBalance')}
                className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow text-center"
              >
                <div className="text-blue-600 text-lg mb-2">Refresh Balance</div>
                <p className="text-gray-500 text-sm">Get your latest wallet balance</p>
              </button>
              <button 
                onClick={() => executeAction('getENS')}
                className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow text-center"
              >
                <div className="text-blue-600 text-lg mb-2">Check ENS</div>
                <p className="text-gray-500 text-sm">Look up ENS for your address</p>
              </button>
              <button
                onClick={() => toast.success("Feature coming soon!")} 
                className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow text-center opacity-70"
              >
                <div className="text-blue-600 text-lg mb-2">Deploy Contract</div>
                <p className="text-gray-500 text-sm">Coming soon</p>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
