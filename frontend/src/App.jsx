import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import EditProfile from "./pages/EditProfile";
import Welcome from "./pages/Welcome";
import Interests from "./pages/Interests";
import GamifiedJourney from "./pages/GamifiedJourney";
import ExploreSkills from './pages/ExploreSkills';
import Roadmaps from './pages/Roadmaps';
import RoadmapDetails from './pages/RoadmapDetails';
import SkillDetails from './pages/SkillDetails';
import ProtectedRoute from "./components/ProtectedRoute";
import RedirectIfLoggedIn from "./components/RedirectIfLoggedIn";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route
        path="/login"
        element={
          <RedirectIfLoggedIn>
            <Login />
          </RedirectIfLoggedIn>
        }
      />

      <Route
        path="/signup"
        element={<Signup />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-profile"
        element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/welcome"
        element={
          <ProtectedRoute>
            <Welcome />
          </ProtectedRoute>
        }
      />

      <Route
        path="/interests"
        element={
          <ProtectedRoute>
            <Interests />
          </ProtectedRoute>
        }
      />

      <Route
        path="/gamified-journey"
        element={
          <ProtectedRoute>
            <GamifiedJourney />
          </ProtectedRoute>
        }
      />

      <Route
        path="/explore"
        element={
          <ProtectedRoute>
            <ExploreSkills />
          </ProtectedRoute>
        }
      />

      <Route
        path="/roadmaps"
        element={
          <ProtectedRoute>
            <Roadmaps />
          </ProtectedRoute>
        }
      />


      <Route
        path="/roadmap-details/:id"
        element={
          <ProtectedRoute>
            <RoadmapDetails />
          </ProtectedRoute>
        }
      />


      <Route
        path="/skill-details/:id"
        element={
          <ProtectedRoute>
            <SkillDetails />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
