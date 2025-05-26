import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { registerUser, signIn } from '../firebase/auth';

export const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error('Please enter both email and password');
      }

      if (isLogin) {
        // Login
        await signIn(email, password);
      } else {
        // Register
        if (!username) {
          throw new Error('Please enter a username');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        await registerUser(email, password, username);
      }
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Auth error:', err);
      
      // Handle specific Firebase error codes
      if (err.code === 'auth/operation-not-allowed') {
        setError('Email/password authentication is not enabled. Please contact the administrator.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please login instead.');
        setIsLogin(true);
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please use a stronger password.');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please check your credentials and try again.');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password. Not registered? Create an account below.');
        setIsLogin(true);
      } else {
        // Handle custom validation errors
        setError(err.message || 'An error occurred during authentication');
      }
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  return (
    <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-lg rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">
        {isLogin ? 'Welcome Back!' : 'Join Learning League'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 text-red-300 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/70"
              required
            />
          </div>
        )}
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/70"
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/70"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>

      <p className="mt-4 text-center text-white">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          onClick={switchMode}
          className="text-purple-400 hover:text-purple-300"
        >
          {isLogin ? 'Register' : 'Login'}
        </button>
      </p>
    </div>
  );
};