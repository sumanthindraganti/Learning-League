import React, { useEffect, useState } from 'react';
import { Trophy, Brain, Star, Play, HelpCircle, Award, LogOut, GraduationCap, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { signOut } from '../firebase/auth';
import { getLeaderboard } from '../firebase/db';
import { LeaderboardEntry } from '../types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { userProgress } = useUser();
  const { currentUser } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Calculate progress percentage safely
  const progressPercentage = userProgress.completedLevels 
    ? Math.min((userProgress.completedLevels.length / 8) * 100, 100)
    : 0;
    
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await getLeaderboard(20);
        if (data && data.length > 0) {
          setLeaderboard(data);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setLeaderboard([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Get display name from either userProgress or currentUser
  const displayName = userProgress.username || currentUser?.displayName || 'Explorer';

  return (
    <div className="min-h-screen w-full p-8 space-y-8">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Welcome, {displayName}!
          </h2>
          <p className="text-white/70">Ready to continue your learning journey?</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-semibold transition-colors flex items-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 flex items-center space-x-4">
          <Trophy className="w-8 h-8 text-yellow-400" />
          <div>
            <p className="text-white/70">Game Points</p>
            <p className="text-2xl font-bold text-white">{userProgress.gamePoints || 0}</p>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 flex items-center space-x-4">
          <Brain className="w-8 h-8 text-purple-400" />
          <div>
            <p className="text-white/70">Quiz Points</p>
            <p className="text-2xl font-bold text-white">{userProgress.quizPoints || 0}</p>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 flex items-center space-x-4">
          <Star className="w-8 h-8 text-blue-400" />
          <div>
            <p className="text-white/70">Total Points</p>
            <p className="text-2xl font-bold text-white">{userProgress.totalPoints || 0}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-green-400" />
              <div>
                <h3 className="text-xl font-bold text-white">Current Progress</h3>
                <p className="text-white/70">Keep pushing forward, explorer!</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/70">Current Level</p>
              <p className="text-2xl font-bold text-white">{userProgress.currentLevel || 1}</p>
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/70">Completed Levels</span>
              <span className="text-white font-bold">
                {userProgress.completedLevels?.length || 0} / 8
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Level Scores */}
          {userProgress.levelScores && Object.entries(userProgress.levelScores).length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-white font-semibold">Level Best Scores:</h4>
              {Object.entries(userProgress.levelScores).map(([levelId, score]) => (
                <div key={levelId} className="flex items-center justify-between bg-white/5 p-2 rounded">
                  <span className="text-white/70">Level {levelId}</span>
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-yellow-400" />
                    <span className="text-white font-bold">{score.bestScore}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <h3 className="text-xl font-bold text-white">Leaderboard</h3>
          </div>
          
          {loading ? (
            <div className="text-center py-4 text-white/70">Loading leaderboard...</div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {leaderboard.length > 0 ? (
                leaderboard.map((user, index) => (
                  <div 
                    key={user.id} 
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      currentUser && user.id === currentUser.uid 
                        ? 'bg-purple-500/20 border border-purple-500/50' 
                        : 'bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <span className="text-white font-medium">{user.username}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      {user.bestLevelScores && Object.keys(user.bestLevelScores).length > 0 && (
                        <span className="text-white/70 text-sm">
                          Levels: {Object.keys(user.bestLevelScores).length}
                        </span>
                      )}
                      <span className="text-white font-bold">{user.totalPoints}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-white/70">
                  No leaderboard data available yet. Be the first to score!
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => navigate('/levels')}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Play className="w-5 h-5" />
          Start Learning
        </button>
        <button
          className="px-6 py-3 bg-white/20 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <HelpCircle className="w-5 h-5" />
          Help
        </button>
      </div>

      {/* Certificate Information */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <GraduationCap className="w-8 h-8 text-blue-400" />
          <h3 className="text-xl font-bold text-white">Certificate Achievement</h3>
        </div>
        <div className="space-y-4">
          <p className="text-white/70">
            Complete all 8 levels to earn your C Programming Certificate! Your certificate will include:
          </p>
          <ul className="list-disc list-inside text-white/70 space-y-2">
            <li>Your name and completion date</li>
            <li>Total points earned across all levels</li>
            <li>Official Learning League certification</li>
            <li>Downloadable PDF format</li>
          </ul>
          <div className="bg-blue-500/20 p-4 rounded-lg">
            <p className="text-blue-300">
              🎓 Your certificate will be available for download immediately upon completing Level 8
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};