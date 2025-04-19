import { useState, useEffect } from 'react';
import { registerUser, loginUser, logoutUser, subscribeToAuthChanges, getCurrentUser } from '../utils/auth';

export default function AuthComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    
    try {
      if (isSignUp) {
        await registerUser(email, password, displayName);
      } else {
        await loginUser(email, password);
      }
      // Clear form
      setEmail('');
      setPassword('');
      setDisplayName('');
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      setAuthError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#e0e5ec] text-gray-800 flex flex-col items-center p-6 font-mono">
      <div className="w-full max-w-md p-6 bg-[#e0e5ec] rounded-2xl shadow-neumorph">
        <h2 className="text-2xl mb-6 text-center font-bold">
          {user ? '👋 Welcome!' : isSignUp ? '✨ Create Account' : '🔒 Login'}
        </h2>

        {user ? (
          <div className="text-center">
            <p className="mb-4">
              Logged in as <span className="font-bold">{user.displayName || user.email}</span>
            </p>
            <button
              onClick={handleLogout}
              className="py-2 px-6 rounded-xl bg-[#e0e5ec] text-red-600 shadow-neumorph active:shadow-neumorph-inset"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full p-3 rounded-xl bg-[#e0e5ec] shadow-neumorph focus:outline-none"
                  required
                />
              </div>
              
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full p-3 rounded-xl bg-[#e0e5ec] shadow-neumorph focus:outline-none"
                  required
                />
              </div>
              
              {isSignUp && (
                <div>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Display Name (optional)"
                    className="w-full p-3 rounded-xl bg-[#e0e5ec] shadow-neumorph focus:outline-none"
                  />
                </div>
              )}
              
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#e0e5ec] text-blue-600 font-bold shadow-neumorph active:shadow-neumorph-inset"
              >
                {isSignUp ? 'Sign Up' : 'Login'}
              </button>
            </form>
            
            <div className="mt-4 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-500 hover:underline"
              >
                {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
              </button>
            </div>
          </>
        )}
        
        {authError && (
          <div className="mt-4 p-3 rounded-xl bg-red-100 text-red-700 text-center">
            {authError}
          </div>
        )}
      </div>
    </div>
  );
}