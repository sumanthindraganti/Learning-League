import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Logo } from './components/Logo';
import { AuthForm } from './components/AuthForm';
import { Dashboard } from './components/Dashboard';
import { LevelsPage } from './components/LevelsPage';
import { LevelOne } from './components/LevelOne';
import { LevelTwo } from './components/LevelTwo';
import { LevelThree } from './components/LevelThree';
import { LevelFour } from './components/LevelFour';
import { LevelFive } from './components/LevelFive';
import { LevelSix } from './components/LevelSix';
import { LevelSeven } from './components/LevelSeven';
import { LevelEight } from './components/LevelEight';
import { Diagrams } from './components/Diagrams';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { PrivateRoute } from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-[#0a0b1e] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
            <div className="container mx-auto px-4 py-8">
              <div className="flex flex-col items-center gap-8">
                <Logo />
                <Routes>
                  <Route path="/" element={<AuthForm />} />
                  <Route path="/dashboard" element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  } />
                  <Route path="/levels" element={
                    <PrivateRoute>
                      <LevelsPage />
                    </PrivateRoute>
                  } />
                  <Route path="/diagrams" element={
                    <PrivateRoute>
                      <Diagrams />
                    </PrivateRoute>
                  } />
                  <Route path="/level/1" element={
                    <PrivateRoute>
                      <LevelOne />
                    </PrivateRoute>
                  } />
                  <Route path="/level/2" element={
                    <PrivateRoute>
                      <LevelTwo />
                    </PrivateRoute>
                  } />
                  <Route path="/level/3" element={
                    <PrivateRoute>
                      <LevelThree />
                    </PrivateRoute>
                  } />
                  <Route path="/level/4" element={
                    <PrivateRoute>
                      <LevelFour />
                    </PrivateRoute>
                  } />
                  <Route path="/level/5" element={
                    <PrivateRoute>
                      <LevelFive />
                    </PrivateRoute>
                  } />
                  <Route path="/level/6" element={
                    <PrivateRoute>
                      <LevelSix />
                    </PrivateRoute>
                  } />
                  <Route path="/level/7" element={
                    <PrivateRoute>
                      <LevelSeven />
                    </PrivateRoute>
                  } />
                  <Route path="/level/8" element={
                    <PrivateRoute>
                      <LevelEight />
                    </PrivateRoute>
                  } />
                </Routes>
              </div>
            </div>
          </div>
        </BrowserRouter>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;